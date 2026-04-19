using System;

namespace Inventory.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "viewer"; // 'admin' or 'viewer'
    public string? PictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
