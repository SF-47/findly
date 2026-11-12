using backend.Models;

public class ItemsMatch
{
    public Guid Id { get; set; }

    public Guid LostItemId { get; set; }
    public LostItem LostItem { get; set; } = null!;

    public Guid FoundItemId { get; set; }
    public FoundItem FoundItem { get; set; } = null!;

    public int MatchPercentage { get; set; }

    public string ConfidenceLevel { get; set; } = "Low";
    public string ReasoningSummary { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReviewedAt { get; set; }

    public Guid? ReviewedByAdminId { get; set; }
    public Admin? ReviewedByAdmin { get; set; }
}
