using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Student> Students { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<LostItem> LostItems { get; set; }
    public DbSet<FoundItem> FoundItems { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<University> Universities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
        modelBuilder
            .Entity<University>()
            .HasIndex(u => new
            {
                u.ShortName,
                u.FullName,
                u.Branch,
            })
            .IsUnique();
    }

    //This tells EF Core:
    // Category.Name must be unique in the database.

    // The service validation is good, but the database should also protect itself.
}
