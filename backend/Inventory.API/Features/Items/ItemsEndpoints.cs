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

namespace Inventory.API.Features.Items;

public static class ItemsEndpoints
{
    public static void MapItemsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/items").RequireAuthorization().WithTags("Items");

        // 3. PATCH /items/:id (El Multi-Herramienta)

        group.MapPatch("/{id:int}", async (int id, UpdateItemCommand command, ISender sender) =>
        {
            if (id != command.Id) return Results.BadRequest("Id mismatch");
            var result = await sender.Send(command);
            return result != null ? Results.Ok(result) : Results.NotFound();
        }).RequireAuthorization("RequireAdmin");

        // 4. DELETE /items/:id (El Limpiador)
        group.MapDelete("/{id:int}", async (int id, ISender sender) =>
        {
            var result = await sender.Send(new DeleteItemCommand(id));
            return result ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization("RequireAdmin");
    }
}

// --- Queries & Commands ---

public record UpdateItemCommand(int Id, string? Name, decimal? Price, int? Quantity, string? Status) : IRequest<Product?>;

public record DeleteItemCommand(int Id) : IRequest<bool>;

// --- Handlers ---


public class UpdateItemHandler(InventoryDbContext context) : IRequestHandler<UpdateItemCommand, Product?>
{
    public async Task<Product?> Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FindAsync(new object[] { request.Id }, cancellationToken);
        if (product == null) return null;

        if (request.Name != null) product.Name = request.Name;
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.Quantity.HasValue) product.Quantity = request.Quantity.Value;
        if (request.Status != null) product.Status = request.Status;

        await context.SaveChangesAsync(cancellationToken);
        return product;
    }
}

public class DeleteItemHandler(InventoryDbContext context) : IRequestHandler<DeleteItemCommand, bool>
{
    public async Task<bool> Handle(DeleteItemCommand request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FindAsync(new object[] { request.Id }, cancellationToken);
        if (product == null) return false;

        context.Products.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

