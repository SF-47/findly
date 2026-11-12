namespace backend.Models;

public class University
{
    public Guid Id { get; set; }

    public string ShortName { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Branch { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}