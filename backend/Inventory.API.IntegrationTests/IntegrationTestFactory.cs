using System.Security.Claims;
using System.Text.Encodings.Web;
using Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;
using NSubstitute;
using Ai;
using Grpc.Core;
using Grpc.Net.Client;

namespace Inventory.API.IntegrationTests;

public class IntegrationTestFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:17-alpine")
        .WithDatabase("inventory_test")
        .WithUsername("test")
        .WithPassword("test")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // Setup fake authentication
            services.AddAuthentication(defaultScheme: "TestScheme")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    "TestScheme", options => { });

            // Remove existing DbContext
            services.RemoveAll(typeof(DbContextOptions<InventoryDbContext>));

            // Add specialized DbContext for testing
            services.AddDbContext<InventoryDbContext>(options =>
            {
                options.UseNpgsql(_dbContainer.GetConnectionString());
            });

            // 🤖 Real gRPC AI Service Client (Point-to-Point)
            // Instead of a Mock, we use the real client pointing to the local container
            services.AddGrpcClient<Ai.AIService.AIServiceClient>(options =>
            {
                options.Address = new Uri("http://localhost:50051");
            });
        });
    }

    public async ValueTask InitializeAsync()
    {
        await _dbContainer.StartAsync();
        
        // Ensure database is created
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
        
        // 1. APPLY EXTENSIONS BEFORE CREATING TABLES
        // This is necessary because indexes (trigrams) depend on the extensions
        await context.Database.OpenConnectionAsync();
        await context.Database.ExecuteSqlRawAsync("CREATE EXTENSION IF NOT EXISTS pg_trgm;");
        await context.Database.ExecuteSqlRawAsync("CREATE EXTENSION IF NOT EXISTS unaccent;");

        // Now we create the tables
        await context.Database.EnsureCreatedAsync();

        // 2. APPLY TRIGGER
        await context.Database.ExecuteSqlRawAsync(@"
            CREATE OR REPLACE FUNCTION products_search_trigger() RETURNS trigger AS $$
            DECLARE
              cat_name TEXT;
            begin
              SELECT name INTO cat_name FROM categories WHERE id = new.category_id;
              new.search_vector :=
                setweight(to_tsvector('english', unaccent(coalesce(new.name,''))), 'A') ||
                setweight(to_tsvector('english', unaccent(coalesce(cat_name,''))), 'B') ||
                setweight(to_tsvector('english', unaccent(coalesce(new.dynamic_attributes::text,''))), 'C');
              return new;
            end
            $$ LANGUAGE plpgsql;
        ");

        await context.Database.ExecuteSqlRawAsync(@"
            DROP TRIGGER IF EXISTS tsvectorupdate ON products;
            CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
                ON products FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
        ");
        
        // Seed some data if needed
        await SeedData(context);
    }

    private async Task SeedData(InventoryDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            context.Categories.Add(new Domain.Entities.Category { Name = "Tools" });
            await context.SaveChangesAsync();
        }
    }

    public new async ValueTask DisposeAsync()
    {
        await _dbContainer.StopAsync();
    }
}

public class TestAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[] 
        { 
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.Role, "admin")
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "TestScheme");

        var result = AuthenticateResult.Success(ticket);

        return Task.FromResult(result);
    }
}
