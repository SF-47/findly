using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext //hon ya3ne : AppDbContext is an EF Core database context.
{
    public AppDbContext(DbContextOptions<AppDbContext> options) //ASP.NET gives database options from Program.cs. //This sends them to the base EF Core DbContext.
        : base(options) { }

    //Each DbSet means:
    //This model has a table in the database.
    public DbSet<Student> Students { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<LostItem> LostItems { get; set; }
    public DbSet<FoundItem> FoundItems { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<University> Universities { get; set; }
    public DbSet<ItemsMatch> Matches { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)//OnModelCreating : This method configures database rules.
    {
        modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();//Unique category name

        //The combination of ShortName + FullName + Branch must be unique.
        modelBuilder
            .Entity<University>()
            .HasIndex(u => new
            {
                u.ShortName,
                u.FullName,
                u.Branch,
            })
            .IsUnique();

        //This means : A student belongs to one university.
        modelBuilder
            .Entity<Student>()
            .HasOne(s => s.University)
            .WithMany()
            .HasForeignKey(s => s.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);

        //This means : The same university student ID cannot be repeated inside the same university.
        modelBuilder
            .Entity<Student>()
            .HasIndex(s => new { s.UniversityId, s.UniversityStudentId })
            .IsUnique();

        //This means : The same lost/found pair can only be saved once.
        //This protects against duplicate AI matches.
        modelBuilder
            .Entity<ItemsMatch>()
            .HasIndex(m => new { m.LostItemId, m.FoundItemId })
            .IsUnique();
    }

    //This tells EF Core:
    // Category.Name must be unique in the database.

    // The service validation is good, but the database should also protect itself.
}
