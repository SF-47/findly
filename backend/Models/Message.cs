namespace backend.Models;

public class Message
{
    public Guid Id { get; set; }
    
    public Guid MatchId { get; set; }
    public ItemsMatch Match { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public Student Sender { get; set; } = null!;
    
    public Guid ReceiverId { get; set; }
    public Student Receiver { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
