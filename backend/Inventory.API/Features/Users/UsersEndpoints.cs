using Inventory.Domain.Entities;
using Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Inventory.API.Features.Users;

public static class UsersEndpoints
{
    public static void MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").RequireAuthorization().WithTags("Users");

        // List all users
        group.MapGet("/", async (ISender sender) =>
        {
            return Results.Ok(await sender.Send(new GetUsersQuery()));
        });

        // Update user role
        group.MapPatch("/{id:int}/role", async (int id, UpdateUserRoleCommand command, ISender sender) =>
        {
            if (id != command.Id) return Results.BadRequest("ID mismatch");
            var result = await sender.Send(command);
            return result ? Results.Ok() : Results.NotFound();
        });
    }
}

// --- Queries & Commands ---
public record GetUsersQuery() : IRequest<List<UserDto>>;
public record UpdateUserRoleCommand(int Id, string Role) : IRequest<bool>;

public record UserDto(int Id, string Email, string Role, string? PictureUrl, DateTime CreatedAt);

// --- Handlers ---
public class GetUsersHandler(InventoryDbContext context) : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        return await context.Users
            .Select(u => new UserDto(u.Id, u.Email, u.Role, u.PictureUrl, u.CreatedAt))
            .ToListAsync(cancellationToken);
    }
}

public class UpdateUserRoleHandler(InventoryDbContext context) : IRequestHandler<UpdateUserRoleCommand, bool>
{
    public async Task<bool> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FindAsync(new object[] { request.Id }, cancellationToken);
        if (user == null) return false;

        // Sanitize role
        if (request.Role != "admin" && request.Role != "viewer") return false;

        user.Role = request.Role;
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
