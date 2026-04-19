using System;
using System.Text.Json;
using NpgsqlTypes;

namespace Inventory.Domain.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = "En Stock";
    
    public int CategoryId { get; set; }
    
    public Category? Category { get; set; }
    
    public JsonDocument? DynamicAttributes { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public NpgsqlTsVector? SearchVector { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
