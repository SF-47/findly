using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Services.Notifications;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Messages
{
    public class MessageService : IMessageService
    {
        public const int MaxContentLength = 2000;

        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public MessageService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        private static readonly string[] OpenStatuses = ["confirmed", "resolved"];

        public async Task<ChatAccess> CheckChatAccessAsync(Guid matchId, Guid studentId)
        {
            var match = await _context
                .Matches.Where(m => m.Id == matchId)
                .Select(m => new
                {
                    m.Status,
                    LostStudentId = m.LostItem.StudentId,
                    FoundStudentId = m.FoundItem.StudentId,
                })
                .FirstOrDefaultAsync();

            if (match is null)
                return new ChatAccess(ChatAccessResult.MatchNotFound);

            if (studentId != match.LostStudentId && studentId != match.FoundStudentId)
                return new ChatAccess(ChatAccessResult.NotParticipant);

            if (!OpenStatuses.Contains(match.Status.ToLowerInvariant()))
                return new ChatAccess(ChatAccessResult.ChatNotOpen);

            var other = studentId == match.LostStudentId ? match.FoundStudentId : match.LostStudentId;
            return new ChatAccess(ChatAccessResult.Allowed, other);
        }

        public async Task<IEnumerable<object>> GetChatHistoryAsync(Guid matchId)
        {
            return await _context
                .Messages.Where(m => m.MatchId == matchId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.SenderId,
                    m.Content,
                    m.CreatedAt,
                })
                .ToListAsync();
        }

        public async Task<Message> SendMessageAsync(
            Guid matchId,
            Guid senderId,
            Guid receiverId,
            string content
        )
        {
            var message = new Message
            {
                MatchId = matchId,
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
            };

            _context.Messages.Add(message);

            
            try
            {
                var receiver = await _context.Students.FindAsync(receiverId);
                var sender = await _context.Students.FindAsync(senderId);

                if (receiver != null)
                {
                    if (!string.IsNullOrWhiteSpace(receiver.ExpoPushToken))
                    {
                        await _notificationService.SendPushNotificationAsync(
                            receiver.ExpoPushToken,
                            $"New message from {sender?.FullName ?? "Student"}",
                            content,
                            new { matchId = matchId, type = "Message" }
                        );
                    }

                    var msgNotification = new Notification
                    {
                        StudentId = receiver.Id,
                        Title = $"New message from {sender?.FullName ?? "Student"}",
                        Message = content,
                        Type = "Message",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow,
                    };
                    _context.Notifications.Add(msgNotification);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send message push notification: {ex.Message}");
            }

            await _context.SaveChangesAsync();

            return message;
        }
    }
}
