using backend.Models;

namespace backend.Services.Messages;

public enum ChatAccessResult
{
    Allowed,
    MatchNotFound,
    NotParticipant,
    ChatNotOpen,
}

/// <param name="OtherStudentId">The other participant of the match, set when access is allowed.</param>
public record ChatAccess(ChatAccessResult Result, Guid? OtherStudentId = null);

public interface IMessageService
{
    /// <summary>
    /// A student may use a match's chat only if they reported its lost or found item,
    /// and only once the match is Confirmed (or later Resolved).
    /// </summary>
    Task<ChatAccess> CheckChatAccessAsync(Guid matchId, Guid studentId);

    Task<IEnumerable<object>> GetChatHistoryAsync(Guid matchId);

    /// <remarks>Callers must check access first; the receiver comes from the match, never from the client.</remarks>
    Task<Message> SendMessageAsync(Guid matchId, Guid senderId, Guid receiverId, string content);
}
