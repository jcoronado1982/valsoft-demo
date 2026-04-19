using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Inventory.Infrastructure.Persistence;
using Inventory.Domain.Entities;

namespace Inventory.API.Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/google", async (GoogleLoginCommand command, ISender sender) =>
        {
            var result = await sender.Send(command);
            return result != null ? Results.Ok(result) : Results.Unauthorized();
        });
    }
}

// --- Commands ---
public record GoogleLoginCommand(string IdToken) : IRequest<AuthResponse?>;
public record AuthResponse(string Token, UserInfo User);
public record UserInfo(int Id, string Name, string Email, string Picture, string Role);

// --- Handlers ---
public class GoogleLoginHandler(IConfiguration config, InventoryDbContext context) : IRequestHandler<GoogleLoginCommand, AuthResponse?>
{
    public async Task<AuthResponse?> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var clientId = config["Google:ClientId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
            if (payload == null) return null;

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email, cancellationToken);
            var superAdmin = config["Auth:SuperAdmin"] ?? "";
            bool isSuperAdminEmail = string.Equals(payload.Email, superAdmin, StringComparison.OrdinalIgnoreCase);

            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    Role = isSuperAdminEmail ? "admin" : "viewer",
                    PictureUrl = payload.Picture
                };
                context.Users.Add(user);
                await context.SaveChangesAsync(cancellationToken);
            }
            var token = GenerateJwtToken(payload.Subject, payload.Email, payload.Name, user.Role, config);
            return new AuthResponse(token, new UserInfo(user.Id, payload.Name, payload.Email, payload.Picture, user.Role));
        }
        catch
        {
            return null;
        }
    }

    private string GenerateJwtToken(string googleId, string email, string name, string role, IConfiguration config)
    {
        var keyStr = config["Jwt:Key"] ?? "CAMBIAR_POR_UNA_CLAVE_DE_AL_MENOS_32_CARACTERES_ALEATORIOS_12345";
        var key = Encoding.UTF8.GetBytes(keyStr);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, googleId),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Role, role),
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = config["Jwt:Issuer"] ?? "backend-csharp",
            Audience = config["Jwt:Audience"] ?? "frontend-angular"
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
