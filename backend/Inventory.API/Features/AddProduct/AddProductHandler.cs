using Inventory.Domain.Entities;
using Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Inventory.API.Features.AddProduct;

public record AddProductCommand(string Name, decimal Price, int Quantity, int? CategoryId, string? Status) : IRequest<AddProductResponse>;

public class AddProductHandler(
    InventoryDbContext context, 
    Ai.AIService.AIServiceClient aiClient) : IRequestHandler<AddProductCommand, AddProductResponse>
{
    public async Task<AddProductResponse> Handle(AddProductCommand request, CancellationToken cancellationToken)
    {
        // 1. Call AI to extract structured data (Always needed for Name and Attributes)
        Ai.ProductResponse aiResponse;
        try 
        {
            var aiRequest = new Ai.ProductRequest { RawText = request.Name };
            aiResponse = await aiClient.ExtractProductAsync(aiRequest, cancellationToken: cancellationToken);
        }
        catch (Grpc.Core.RpcException ex) when (ex.StatusCode == Grpc.Core.StatusCode.Unauthenticated)
        {
            throw new Exception("AI Configuration Error: Geminis API Key has expired or is invalid.", ex);
        }
        catch (Grpc.Core.RpcException ex)
        {
            throw new Exception($"AI Service Error: {ex.Status.Detail}", ex);
        }

        // 2. Create product object with clean data from AI
        var product = new Product
        {
            Name = aiResponse.NombreLimpio,
            Price = request.Price,
            Quantity = request.Quantity,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "In Stock" : request.Status,
            DynamicAttributes = JsonDocument.Parse(aiResponse.AtributosJson) 
        };

        // 3. Assign category (Hybrid Logic)
        if (request.CategoryId.HasValue && request.CategoryId > 0)
        {
            // Respect explicit user choice if a valid ID was sent
            product.CategoryId = request.CategoryId.Value;
        }
        else
        {
            // If no category sent, use the AI suggested category
            var categoryName = aiResponse.CategoriaSugerida;
            var existingCategory = await context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Name == categoryName, cancellationToken);
            
            if (existingCategory != null)
            {
                product.CategoryId = existingCategory.Id;
            }
            else
            {
                product.Category = new Category { Name = categoryName };
            }
        }

        context.Products.Add(product);

        // 4. Save everything in a single atomic transaction
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("IX_categories_name") == true)
        {
            throw new Exception("Conflict creating the category automatically. Please retry the operation.", ex);
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("fkey") == true) 
        {
            // Handle Foreign Key error (non-existent ID)
            throw new Exception($"The selected category (ID: {request.CategoryId}) does not exist in the system.", ex);
        }

        return new AddProductResponse(product.Id, product.Name);

    }
}



