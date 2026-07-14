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
    public DbSet<ItemsMatch> Matches { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }

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

        modelBuilder
            .Entity<Student>()
            .HasOne(s => s.University)
            .WithMany()
            .HasForeignKey(s => s.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<Student>()
            .HasIndex(s => new { s.UniversityId, s.UniversityStudentId })
            .IsUnique();

        modelBuilder
            .Entity<ItemsMatch>()
            .HasIndex(m => new { m.LostItemId, m.FoundItemId })
            .IsUnique();

        modelBuilder
            .Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany()
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
