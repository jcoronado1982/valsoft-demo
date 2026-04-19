using Inventory.Domain.Entities;
using Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Inventory.API.Features.Categories;
using System.Text.Json;

namespace Inventory.API.Features.SearchProducts;

// Structure to wrap the response with pagination metadata
public record PagedResponse<T>(List<T> Items, int TotalCount, List<DynamicFilterDto>? Facets = null);

// 1. LIGHT DTO: To avoid returning the full entity over the network
public record ProductSearchDto(int Id, string Name, decimal Price, int Quantity, string? CategoryName, string Status, string? Brand);

// 2. EXTENDED QUERY: Supports extra filters and pagination
public record SearchProductsQuery(
    string? Term, 
    int? CategoryId = null, 
    Dictionary<string, string>? DynamicFilters = null,
    int Page = 1, 
    int PageSize = 20) : IRequest<PagedResponse<ProductSearchDto>>;

// 3. OPTIMIZED HANDLER
public class SearchProductsHandler(InventoryDbContext context) : IRequestHandler<SearchProductsQuery, PagedResponse<ProductSearchDto>>
{
    public async Task<PagedResponse<ProductSearchDto>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
    {
        // GOLDEN RULE: AsNoTracking() for read-only performance
        var query = context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .AsQueryable();

        // Exact filters (fastest for the database)
        if (request.CategoryId.HasValue && request.CategoryId > 0)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);
        }

        // Advanced PostgreSQL search magic
        if (!string.IsNullOrWhiteSpace(request.Term))
        {
            string term = request.Term.Trim();
            
            // 1. Prepare Lexical Query: "word" -> "word:*" for prefix matching
            var parts = term.Split(' ', System.StringSplitOptions.RemoveEmptyEntries);
            var tsQuery = string.Join(" & ", parts.Select(p => $"{p}:*"));

            query = query.Where(p => 
                // Priority 1: Lexical Search (Stemming + Prefix)
                p.SearchVector!.Matches(EF.Functions.ToTsQuery("english", tsQuery)) 
                ||
                // Priority 2: Fuzzy Search (Trigrams) on Product Name
                EF.Functions.TrigramsAreSimilar(p.Name, term)
                ||
                // Priority 3: Fuzzy Search on Category Name (if exists)
                (p.Category != null && EF.Functions.TrigramsAreSimilar(p.Category.Name, term))
            )
            // Ordering: FTS Rank first, then Name similarity for ties/fuzzy matches
            .OrderByDescending(p => p.SearchVector!.Rank(EF.Functions.ToTsQuery("english", tsQuery)))
            .ThenByDescending(p => EF.Functions.TrigramsAreSimilar(p.Name, term));
        }
        else
        {
            // If no term searched, show recent items
            query = query.OrderByDescending(p => p.CreatedAt);
        }

        // 3. Ultra Fast & Safe JSONB Filtering
        if (request.DynamicFilters != null && request.DynamicFilters.Any())
        {
            // Serialize filters to a JSON string for comparison
            var jsonFilter = System.Text.Json.JsonSerializer.Serialize(request.DynamicFilters);
            
            // JsonContains invokes PostgreSQL @> operator, utilizing jsonb_path_ops index
            query = query.Where(p => p.DynamicAttributes != null && EF.Functions.JsonContains(p.DynamicAttributes, jsonFilter));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // --- Calculate Dynamic Facets ---
        // Fetch only the JSONB properties for the filtered query (this is fast even for large sets because it ignores large texts)
        var attributesList = await query.Select(p => p.DynamicAttributes).ToListAsync(cancellationToken);
        var dynamicFiltersDict = new Dictionary<string, Dictionary<string, int>>();

        foreach (var doc in attributesList)
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

        var facets = dynamicFiltersDict
            .Select(kvp => new DynamicFilterDto(
                kvp.Key,
                kvp.Value
                    .Select(v => new FilterValueDto(v.Key, v.Value))
                    .OrderBy(v => v.Value) // Alphabetical by property value
                    .ToList()
            ))
            // Prioritize Brand and specific attributes, else alphabetical
            .OrderByDescending(f => f.FilterName.Equals("Brand", System.StringComparison.OrdinalIgnoreCase))
            .ThenBy(f => f.FilterName)
            .ToList();

        // Pagination and Projection
        var itemsProjection = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new {
                p.Id,
                p.Name,
                p.Price,
                p.Quantity,
                CategoryName = p.Category != null ? p.Category.Name : null,
                p.Status,
                p.DynamicAttributes
            })
            .ToListAsync(cancellationToken);

        var items = itemsProjection.Select(p => {
            string? brand = null;
             if (p.DynamicAttributes != null)
             {
                 foreach (var prop in p.DynamicAttributes.RootElement.EnumerateObject())
                 {
                     if (string.Equals(prop.Name, "Brand", StringComparison.OrdinalIgnoreCase))
                     {
                         brand = prop.Value.ValueKind == JsonValueKind.String ? prop.Value.GetString() : prop.Value.ToString();
                         break;
                     }
                 }
             }
            return new ProductSearchDto(p.Id, p.Name, p.Price, p.Quantity, p.CategoryName, p.Status, brand);
        }).ToList();

        return new PagedResponse<ProductSearchDto>(items, totalCount, facets);
    }
}



