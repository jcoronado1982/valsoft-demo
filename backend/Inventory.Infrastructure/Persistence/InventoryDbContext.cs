using Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Persistence;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityByDefaultColumn();
            
            entity.Property(e => e.Name).HasColumnName("name").IsRequired();
            entity.HasIndex(e => e.Name).IsUnique();
                  
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityByDefaultColumn();
            
            entity.Property(e => e.Email).HasColumnName("email").IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.Property(e => e.Role).HasColumnName("role").IsRequired().HasDefaultValue("viewer");
            entity.Property(e => e.PictureUrl).HasColumnName("picture_url");
            
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityByDefaultColumn();
            
            entity.Property(e => e.Name).HasColumnName("name").IsRequired();
            entity.Property(e => e.Quantity).HasColumnName("quantity").HasDefaultValue(0);
            entity.Property(e => e.Price).HasColumnName("price").HasColumnType("numeric(15,2)").HasDefaultValue(0m);
            entity.Property(e => e.Status).HasColumnName("status").HasDefaultValue("In Stock").HasMaxLength(50);
                  
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.HasOne(e => e.Category).WithMany(c => c.Products).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.Cascade);
                  
            entity.Property(e => e.DynamicAttributes).HasColumnName("dynamic_attributes").HasColumnType("jsonb").HasDefaultValueSql("'{}'::jsonb");
            entity.Property(e => e.SearchVector)
                  .HasColumnName("search_vector")
                  .HasColumnType("tsvector")
                  .ValueGeneratedOnAddOrUpdate();
            
            entity.HasIndex(e => e.SearchVector).HasMethod("GIN");

            // Search by spelling errors (Trigrams)
            entity.HasIndex(e => e.Name)
                  .HasMethod("GIN")
                  .HasOperators("gin_trgm_ops")
                  .HasDatabaseName("IX_products_name_trgm");

            // Ultra fast search within JSONB
            entity.HasIndex(e => e.DynamicAttributes)
                  .HasMethod("GIN")
                  .HasOperators("jsonb_path_ops")
                  .HasDatabaseName("idx_products_jsonb_fast");

            
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}
