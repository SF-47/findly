using backend.Data;
using backend.Models;
using backend.Requests.Messages;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Messages;

public class MessageService : IMessageService
{
    private readonly AppDbContext _context;

    public MessageService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<object>> GetChatHistoryAsync(Guid matchId)
    {
        return await _context.Messages
            .Where(m => m.MatchId == matchId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new { m.Id, m.SenderId, m.Content, m.CreatedAt })
            .ToListAsync();
    }

    public async Task<Message> SendMessageAsync(Guid matchId, Guid senderId, SendMessageRequest request)
    {
        var message = new Message
        {
            MatchId = matchId,
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            Content = request.Content
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return message;
    }
}
