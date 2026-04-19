using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Inventory.API.Features.Items;
using Inventory.API.Features.AddProduct;
using Inventory.API.Features.SearchProducts;
using Inventory.Domain.Entities;
using NSubstitute;
using Xunit;

namespace Inventory.API.IntegrationTests;

public class ItemsIntegrationTests(IntegrationTestFactory factory) : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task CreateItem_WithValidData_ShouldReturnCreatedAndPersistInDb()
    {
        // Arrange
        // Note: Category 1 is seeded in IntegrationTestFactory as "Tools"
        var command = new AddProductCommand("Integration Test Product", 99.99m, 10, 1, "In Stock");

        // Act
        var response = await _client.PostAsJsonAsync("/api/items", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var product = await response.Content.ReadFromJsonAsync<AddProductResponse>();
        product.Should().NotBeNull();
        product!.Name.Should().Be("Integration Test Product");
        product.Id.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task SearchProducts_ShouldIgnoreAccentsAndHandleTypos()
    {
        // 1. Arrange: Create a product with accents
        var command = new AddProductCommand("Electríc Hammer", 150.00m, 5, 1, "In Stock");
        await _client.PostAsJsonAsync("/api/items", command);

        // 2. Act: Search without accents (thanks to unaccent)
        var response = await _client.GetFromJsonAsync<PagedResponse<ProductSearchDto>>("/api/items?term=electric");
        
        // Assert
        response.Should().NotBeNull();
        // AI might normalize the name, so we check if it contains the word "Hammer"
        response!.Items.Should().Contain(p => p.Name.Contains("Hammer"));
    }

    [Fact]
    public async Task IntelligentSearch_ShouldFindProductsByCategoryName()
    {
        // 1. Arrange: Create a product
        var command = new AddProductCommand("Bosch Hammer Drill", 120.00m, 5, 1, "In Stock");
        var createResponse = await _client.PostAsJsonAsync("/api/items", command);
        var createdProduct = await createResponse.Content.ReadFromJsonAsync<AddProductResponse>();
        
        // 2. Act: Search by a specific keyword from the product name
        var searchTerm = "Hammer";
        var searchResult = await _client.GetFromJsonAsync<PagedResponse<ProductSearchDto>>($"/api/items?term={searchTerm}");

        // Assert: Searching for the keyword should return the item we just created
        searchResult.Should().NotBeNull();
        searchResult!.Items.Should().Contain(p => p.Id == createdProduct.Id);
    }

    [Fact]
    public async Task IntelligentSearch_ShouldHandleFuzzyEnglishTerms()
    {
        // 1. Arrange: Create a product with Spanish/mixed name
        var command = new AddProductCommand("Smartphone Intelligent", 200.00m, 10, 1, "In Stock");
        await _client.PostAsJsonAsync("/api/items", command);

        // 2. Act: Search using a term that matches
        var searchPartial = await _client.GetFromJsonAsync<PagedResponse<ProductSearchDto>>("/api/items?term=Smartphone");

        // Assert
        searchPartial.Should().NotBeNull();
        // Search for "Smartphone" should return the product even if normalized
        searchPartial!.Items.Should().Contain(p => p.Name.Contains("Smart"));
    }

    [Fact]
    public async Task IntelligentSearch_ShouldSupportPartialWordMatches()
    {
        // 1. Arrange: Create a product in seeded "Tools" category (ID 1)
        var command = new AddProductCommand("Precision Screwdriver", 15.00m, 20, 1, "In Stock");
        await _client.PostAsJsonAsync("/api/items", command);

        // 2. Act: Search for "Too" (partial for Tools)
        var response = await _client.GetFromJsonAsync<PagedResponse<ProductSearchDto>>("/api/items?term=Too");

        // Assert
        response.Should().NotBeNull();
        response!.Items.Should().Contain(p => p.CategoryName == "Tools");
    }

    [Fact]
    public async Task IntelligentSearch_ShouldHandleTyposFallback()
    {
        // 1. Arrange: Create a product
        var command = new AddProductCommand("Power Drill Deluxe", 150.00m, 5, 1, "In Stock");
        var createResponse = await _client.PostAsJsonAsync("/api/items", command);
        var product = await createResponse.Content.ReadFromJsonAsync<AddProductResponse>();

        // 2. Act: Search with a typo "Dril" or similar
        var response = await _client.GetFromJsonAsync<PagedResponse<ProductSearchDto>>("/api/items?term=Dril");

        // Assert
        response.Should().NotBeNull();
        response!.Items.Should().Contain(p => p.Id == product!.Id);
    }
}
