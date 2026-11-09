namespace backend.Requests.Messages;

public class SendMessageRequest
{
    /// <summary>Ignored: the server always sends to the other student of the match. Kept so older app builds still bind.</summary>
    public Guid ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
}
