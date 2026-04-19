using Inventory.API.Features.SearchProducts;
using Inventory.Infrastructure.Persistence;
using Inventory.API.Features.AddProduct;
using Inventory.API.Features.Items;
using Inventory.API.Features.Categories;
using Inventory.API.Features.Auth;
using Inventory.API.Features.Users;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Microsoft.Extensions.AI;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Configure JSON options to ignore cycles and use camelCase
builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// Add service defaults & Aspire client integration.
builder.AddServiceDefaults();

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Persistence
builder.Services.AddDbContext<InventoryDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("inventorydb") 
                          ?? builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});



builder.Services.AddHealthChecks()
    .AddDbContextCheck<InventoryDbContext>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(builder.Configuration["AllowedOrigins"] ?? "http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// JWT Authentication
builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing from configuration.");
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "backend-csharp",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "frontend-angular",
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("admin"));
});

// 🛡️ API Rate Limiting to prevent DoS attacks
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        return RateLimitPartition.GetFixedWindowLimiter("global", _ => new FixedWindowRateLimiterOptions
        {
            AutoReplenishment = true,
            PermitLimit = 100,
            QueueLimit = 0,
            Window = TimeSpan.FromMinutes(1)
        });
    });
});

// 🤖 Register the gRPC client using Aspire Service Discovery
builder.Services.AddGrpcClient<Ai.AIService.AIServiceClient>(options =>
{
    // This will automatically get the correct URL (e.g., http://localhost:50051 or the container IP)
    var aiUrl = builder.Configuration["services:ai:grpc:0"] ?? "http://ai:50051";
    
    // Grpc.Net.Client explicitly requires http:// or https:// scheme
    if (aiUrl.StartsWith("tcp://", StringComparison.OrdinalIgnoreCase))
    {
        aiUrl = "http://" + aiUrl.Substring(6);
    }
    
    options.Address = new Uri(aiUrl);
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var maxRetries = 5;
    var delay = TimeSpan.FromSeconds(2);
    
    for (int i = 1; i <= maxRetries; i++)
    {
        try 
        {
            Console.WriteLine($"🚀 Starting Database Migration (Attempt {i}/{maxRetries})...");
            var context = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
            context.Database.Migrate();
            Console.WriteLine("✅ Database migration completed successfully.");
            break;
        }
        catch (Exception ex) when (i < maxRetries)
        {
            Console.WriteLine($"⚠️ Database not ready yet ({ex.Message}). Retrying in {delay.TotalSeconds}s...");
            Thread.Sleep(delay);
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ CRITICAL: Database migration failed after all attempts!");
            Console.WriteLine($"   Error: {ex.Message}");
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => 
    {
        options
            .WithTitle("Inventory API")
            .WithTheme(ScalarTheme.Purple);
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

// Map Vertical Slices
app.MapAuthEndpoints();
app.MapAddProduct();
app.MapSearchProducts();
app.MapItemsEndpoints();
app.MapFiltersEndpoints();
app.MapUsersEndpoints();

app.MapDefaultEndpoints();

app.Run();

public partial class Program { }
