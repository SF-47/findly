using System.Security.Claims;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("notifications")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NotificationsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /notifications
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var studentIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(studentIdStr, out var studentId))
                return Unauthorized();

            var notifications = await _db
                .Notifications.Where(n => n.StudentId == studentId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        // PUT: /notifications/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var notification = await _db.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _db.SaveChangesAsync();
            return Ok(notification);
        }

        // PUT: /notifications/read-all
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var studentIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(studentIdStr, out var studentId))
                return Unauthorized();

            var unread = await _db
                .Notifications.Where(n => n.StudentId == studentId && !n.IsRead)
                .ToListAsync();

            foreach (var n in unread)
            {
                n.IsRead = true;
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
