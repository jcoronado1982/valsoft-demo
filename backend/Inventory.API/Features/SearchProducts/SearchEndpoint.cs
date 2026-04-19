using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Inventory.API.Features.SearchProducts;

public static class SearchEndpoint
{
    public static void MapSearchProducts(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/items", async (HttpRequest request, ISender sender) =>
        {
            request.Query.TryGetValue("term", out var termValues);
            request.Query.TryGetValue("categoryId", out var categoryIdValues);
            request.Query.TryGetValue("page", out var pageValues);
            request.Query.TryGetValue("pageSize", out var pageSizeValues);
            
            string? term = termValues.FirstOrDefault();
            int? categoryId = int.TryParse(categoryIdValues.FirstOrDefault(), out var id) ? id : null;
            int page = int.TryParse(pageValues.FirstOrDefault(), out var p) ? p : 1;
            int pageSize = int.TryParse(pageSizeValues.FirstOrDefault(), out var ps) ? ps : 10;

            var dynamicFilters = new Dictionary<string, string>();
            var reservedKeys = new[] { "term", "categoryId", "page", "pageSize" };
            
            foreach (var key in request.Query.Keys)
            {
                if (!reservedKeys.Contains(key) && !string.IsNullOrWhiteSpace(request.Query[key].FirstOrDefault()))
                {
                    dynamicFilters[key] = request.Query[key].FirstOrDefault()!;
                }
            }

            var query = new SearchProductsQuery(term, categoryId, dynamicFilters, page, pageSize);
            var results = await sender.Send(query);
            return Results.Ok(results);
        })
        .WithName("SearchProducts")
        .RequireAuthorization()
        .WithTags("Items");
    }
}
