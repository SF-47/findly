using backend.Models;
using backend.Requests.Messages;

namespace backend.Services.Messages;

public interface IMessageService
{
    Task<IEnumerable<object>> GetChatHistoryAsync(Guid matchId);
    Task<Message> SendMessageAsync(Guid matchId, Guid senderId, SendMessageRequest request);
}
