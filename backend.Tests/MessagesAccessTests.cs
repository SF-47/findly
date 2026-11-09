using System.Security.Claims;
using backend.Controllers;
using backend.Data;
using backend.Models;
using backend.Requests.Messages;
using backend.Services.Messages;
using backend.Services.Notifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests;

/// <summary>
/// Chat messages may only be read or sent by the two students of a match,
/// and only once an admin has confirmed it (or after it was resolved).
/// </summary>
public class MessagesAccessTests
{
    private sealed class NoPush : INotificationService
    {
        public Task SendPushNotificationAsync(string pushToken, string title, string body, object? data = null) => Task.CompletedTask;
    }

    private sealed record World(AppDbContext Db, Student Loser, Student Finder, Student Outsider, ItemsMatch Match);

    private static World Seed(string matchStatus = "Confirmed", bool outsiderVerified = true)
    {
        var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

        var uni = new University { Id = Guid.NewGuid() };
        Student NewStudent(string name, bool verified = true) =>
            new() { Id = Guid.NewGuid(), FullName = name, Email = $"{name}@uni.test", UniversityId = uni.Id, UniversityStudentId = name, IsVerified = verified };

        var loser = NewStudent("loser");
        var finder = NewStudent("finder");
        var outsider = NewStudent("outsider", outsiderVerified);
        var category = new Category { Id = 1, Name = "Electronics" };
        var lost = new LostItem { Id = Guid.NewGuid(), StudentId = loser.Id, CategoryId = 1, ItemName = "Case", Status = matchStatus };
        var found = new FoundItem { Id = Guid.NewGuid(), StudentId = finder.Id, CategoryId = 1, ItemName = "Case", Status = matchStatus };
        var match = new ItemsMatch { Id = Guid.NewGuid(), LostItemId = lost.Id, FoundItemId = found.Id, Status = matchStatus, MatchPercentage = 86 };

        db.AddRange(uni, loser, finder, outsider, category, lost, found, match);
        db.Messages.Add(new Message { Id = Guid.NewGuid(), MatchId = match.Id, SenderId = finder.Id, ReceiverId = loser.Id, Content = "I found it" });
        db.SaveChanges();
        return new World(db, loser, finder, outsider, match);
    }

    private static MessagesController ControllerAs(World w, Student student)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()), new Claim(ClaimTypes.Role, "Student")], "test"));
        return new MessagesController(new MessageService(w.Db, new NoPush()), w.Db)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } },
        };
    }

    private static int? StatusOf(IActionResult r) => r switch
    {
        ObjectResult o => o.StatusCode ?? 200,
        StatusCodeResult s => s.StatusCode,
        _ => null,
    };

    [Fact]
    public async Task Participant_can_read_a_confirmed_chat()
    {
        var w = Seed();
        Assert.Equal(200, StatusOf(await ControllerAs(w, w.Loser).GetChatHistory(w.Match.Id)));
        Assert.Equal(200, StatusOf(await ControllerAs(w, w.Finder).GetChatHistory(w.Match.Id)));
    }

    [Fact]
    public async Task Participant_can_still_read_a_resolved_chat()
    {
        var w = Seed("Resolved");
        Assert.Equal(200, StatusOf(await ControllerAs(w, w.Loser).GetChatHistory(w.Match.Id)));
    }

    [Fact]
    public async Task Verified_student_outside_the_match_cannot_read_it()
    {
        var w = Seed();
        Assert.Equal(403, StatusOf(await ControllerAs(w, w.Outsider).GetChatHistory(w.Match.Id)));
    }

    [Theory]
    [InlineData("Pending")]
    [InlineData("Rejected")]
    public async Task Chat_is_closed_until_an_admin_confirms(string status)
    {
        var w = Seed(status);
        Assert.Equal(403, StatusOf(await ControllerAs(w, w.Loser).GetChatHistory(w.Match.Id)));
        Assert.Equal(403, StatusOf(await ControllerAs(w, w.Loser).SendMessage(w.Match.Id, new SendMessageRequest { Content = "hi" })));
        Assert.Equal(1, await w.Db.Messages.CountAsync());
    }

    [Fact]
    public async Task Unknown_match_returns_404()
    {
        var w = Seed();
        Assert.Equal(404, StatusOf(await ControllerAs(w, w.Loser).GetChatHistory(Guid.NewGuid())));
    }

    [Fact]
    public async Task Outsider_cannot_post_into_a_match()
    {
        var w = Seed();
        var result = await ControllerAs(w, w.Outsider).SendMessage(w.Match.Id, new SendMessageRequest { ReceiverId = w.Loser.Id, Content = "spam" });

        Assert.Equal(403, StatusOf(result));
        Assert.Equal(1, await w.Db.Messages.CountAsync());
    }

    [Fact]
    public async Task Receiver_is_always_the_other_participant_whatever_the_client_sends()
    {
        var w = Seed();
        var result = await ControllerAs(w, w.Loser).SendMessage(w.Match.Id, new SendMessageRequest { ReceiverId = w.Outsider.Id, Content = "Is it mine?" });

        Assert.Equal(200, StatusOf(result));
        var saved = await w.Db.Messages.SingleAsync(m => m.Content == "Is it mine?");
        Assert.Equal(w.Loser.Id, saved.SenderId);
        Assert.Equal(w.Finder.Id, saved.ReceiverId);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Empty_messages_are_rejected(string content)
    {
        var w = Seed();
        Assert.Equal(400, StatusOf(await ControllerAs(w, w.Loser).SendMessage(w.Match.Id, new SendMessageRequest { Content = content })));
    }

    [Fact]
    public async Task Overlong_messages_are_rejected()
    {
        var w = Seed();
        var content = new string('a', MessageService.MaxContentLength + 1);
        Assert.Equal(400, StatusOf(await ControllerAs(w, w.Loser).SendMessage(w.Match.Id, new SendMessageRequest { Content = content })));
    }

    [Fact]
    public async Task Unverified_student_is_still_blocked()
    {
        var w = Seed(outsiderVerified: false);
        Assert.Equal(403, StatusOf(await ControllerAs(w, w.Outsider).GetChatHistory(w.Match.Id)));
    }

    [Fact]
    public async Task Sent_message_response_does_not_expose_student_records()
    {
        var w = Seed();
        w.Finder.PasswordHash = "$2a$11$secret-hash";
        w.Finder.PhoneNumber = "+961 70 000 000";
        w.Db.SaveChanges();

        var result = await ControllerAs(w, w.Loser).SendMessage(w.Match.Id, new SendMessageRequest { Content = "hello" });
        var json = System.Text.Json.JsonSerializer.Serialize(((ObjectResult)result).Value, new System.Text.Json.JsonSerializerOptions { ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles });

        Assert.DoesNotContain("secret-hash", json);
        Assert.DoesNotContain("+961", json);
        Assert.Contains("hello", json);
    }
}
