using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Requests.Messages;
using backend.Services.Notifications;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Messages
{
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public MessageService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
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
            SendMessageRequest request
        )
        {
            var message = new Message
            {
                MatchId = matchId,
                SenderId = senderId,
                ReceiverId = request.ReceiverId,
                Content = request.Content,
            };

            _context.Messages.Add(message);

            
            try
            {
                var receiver = await _context.Students.FindAsync(request.ReceiverId);
                var sender = await _context.Students.FindAsync(senderId);

                if (receiver != null)
                {
                    if (!string.IsNullOrWhiteSpace(receiver.ExpoPushToken))
                    {
                        await _notificationService.SendPushNotificationAsync(
                            receiver.ExpoPushToken,
                            $"New message from {sender?.FullName ?? "Student"}",
                            request.Content,
                            new { matchId = matchId, type = "Message" }
                        );
                    }

                    var msgNotification = new Notification
                    {
                        StudentId = receiver.Id,
                        Title = $"New message from {sender?.FullName ?? "Student"}",
                        Message = request.Content,
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
