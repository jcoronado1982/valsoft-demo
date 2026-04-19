using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Features.AddProduct;

public static class AddProductEndpoint
{
    public static void MapAddProduct(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/items", async (AddProductCommand command, ISender sender) =>
        {
            var response = await sender.Send(command);
            return Results.Created($"/items/{response.Id}", response);
        })
        .WithName("AddProduct")
        .RequireAuthorization("RequireAdmin")
        .WithTags("Items");
    }

}
