using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Tests;

/// <summary>Generates SQL only; no database connection is opened.</summary>
public class MigrationScriptTests
{
    private static string Script(string from, string to)
    {
        using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseNpgsql("Host=localhost;Database=none").Options);
        return db.GetService<IMigrator>().GenerateScript(from, to);
    }

    [Fact]
    public void Rls_migration_is_discovered_and_is_the_latest()
    {
        using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseNpgsql("Host=localhost;Database=none").Options);
        Assert.Equal("20261110120000_EnableRowLevelSecurity", db.Database.GetMigrations().Last());
    }

    [Fact]
    public void Up_enables_rls_on_every_app_table_and_drops_messages_from_realtime()
    {
        var sql = Script("20260714144451_AddNotificationsTable", "20261110120000_EnableRowLevelSecurity");

        Assert.Contains("ENABLE ROW LEVEL SECURITY", sql);
        foreach (var table in new[] { "Admins", "Categories", "FoundItems", "LostItems", "Matches", "Messages", "Notifications", "Students", "Universities" })
            Assert.Contains($"'{table}'", sql);
        Assert.Contains("ALTER PUBLICATION supabase_realtime DROP TABLE public.\"Messages\"", sql);
        Assert.Contains("RAISE EXCEPTION", sql);
        Assert.DoesNotContain("{{", sql);
    }

    [Fact]
    public void Down_disables_rls()
    {
        var sql = Script("20261110120000_EnableRowLevelSecurity", "20260714144451_AddNotificationsTable");
        Assert.Contains("DISABLE ROW LEVEL SECURITY", sql);
    }
}
