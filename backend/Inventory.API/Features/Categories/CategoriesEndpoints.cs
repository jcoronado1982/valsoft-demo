using Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Inventory.API.Features.Categories;

public static class FiltersEndpoints
{
    public static void MapFiltersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/filters").RequireAuthorization().WithTags("Filters");

        group.MapGet("/", async (ISender sender) =>
        {
            var result = await sender.Send(new GetFiltersQuery());
            return Results.Ok(result);
        });
    }
}

public record CategoryDto(int Id, string Name, int ItemCount);
public record FilterValueDto(string Value, int ItemCount);
public record DynamicFilterDto(string FilterName, List<FilterValueDto> Options);
public record FiltersResponse(List<CategoryDto> Categories, List<DynamicFilterDto> DynamicFilters);

public record GetFiltersQuery() : IRequest<FiltersResponse>;

public class GetFiltersHandler(InventoryDbContext context) : IRequestHandler<GetFiltersQuery, FiltersResponse>
{
    public async Task<FiltersResponse> Handle(GetFiltersQuery request, CancellationToken cancellationToken)
    {
        var categories = await context.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(
                c.Id, 
                c.Name, 
                c.Products.Count()
            ))
            .ToListAsync(cancellationToken);

        var products = await context.Products.Select(p => p.DynamicAttributes).ToListAsync(cancellationToken);
        
        var dynamicFiltersDict = new Dictionary<string, Dictionary<string, int>>();

        foreach (var doc in products)
        {
            if (doc == null) continue;

            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                var key = prop.Name;
                var value = prop.Value.ValueKind == System.Text.Json.JsonValueKind.String 
                    ? prop.Value.GetString() 
                    : prop.Value.ToString();

                if (string.IsNullOrWhiteSpace(value)) continue;

                if (!dynamicFiltersDict.ContainsKey(key))
                {
                    dynamicFiltersDict[key] = new Dictionary<string, int>();
                }

                if (!dynamicFiltersDict[key].ContainsKey(value))
                {
                    dynamicFiltersDict[key][value] = 0;
                }

                dynamicFiltersDict[key][value]++;
            }
        }

        var dynamicFilters = dynamicFiltersDict
            .Select(kvp => new DynamicFilterDto(
                kvp.Key,
                kvp.Value
                    .Select(v => new FilterValueDto(v.Key, v.Value))
                    .OrderBy(v => v.Value) // Alphabetical by property value
                    .ToList()
            ))
            .OrderBy(f => f.FilterName) // Alphabetical by property name
            .ToList();

        return new FiltersResponse(categories, dynamicFilters);
    }
}
