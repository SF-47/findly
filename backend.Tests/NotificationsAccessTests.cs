using System.Security.Claims;
using backend.Controllers;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests;

public class NotificationsAccessTests
{
    private static (AppDbContext db, Notification note) Seed(Guid ownerId)
    {
        var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        var note = new Notification { StudentId = ownerId, Title = "New message", Message = "private chat text", Type = "Message" };
        db.Notifications.Add(note);
        db.SaveChanges();
        return (db, note);
    }

    private static NotificationsController As(AppDbContext db, Guid studentId) =>
        new(db)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, studentId.ToString())], "test")),
                },
            },
        };

    [Fact]
    public async Task Owner_can_mark_their_notification_as_read()
    {
        var owner = Guid.NewGuid();
        var (db, note) = Seed(owner);

        Assert.IsType<OkObjectResult>(await As(db, owner).MarkAsRead(note.Id));
        Assert.True((await db.Notifications.SingleAsync()).IsRead);
    }

    [Fact]
    public async Task Another_student_cannot_mark_or_read_someone_elses_notification()
    {
        var (db, note) = Seed(Guid.NewGuid());

        var result = await As(db, Guid.NewGuid()).MarkAsRead(note.Id);

        Assert.IsType<ForbidResult>(result);
        Assert.False((await db.Notifications.SingleAsync()).IsRead);
    }
}
