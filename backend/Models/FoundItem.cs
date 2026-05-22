namespace backend.Models;

public class FoundItem
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public int CategoryId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime FoundDate { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Open";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Student Student { get; set; } = null!;
    public Category Category { get; set; } = null!;
}