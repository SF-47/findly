using System.Security.Claims;
using backend.Data;
using backend.Requests.Messages;
using backend.Services.Messages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("matches/{matchId}/messages")]
[ApiController]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly AppDbContext _db;

    public MessagesController(IMessageService messageService, AppDbContext db)
    {
        _messageService = messageService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetChatHistory(Guid matchId)
    {
        var studentIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(studentIdStr, out var studentId))
        {
            return Unauthorized();
        }

        var verifiedAccessResult = await CheckVerifiedStudentAccess(studentId);
        if (verifiedAccessResult is not null)
        {
            return verifiedAccessResult;
        }

        var messages = await _messageService.GetChatHistoryAsync(matchId);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(
        Guid matchId,
        [FromBody] SendMessageRequest request
    )
    {
        var senderIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(senderIdStr, out var senderId))
            return Unauthorized();

        var verifiedAccessResult = await CheckVerifiedStudentAccess(senderId);
        if (verifiedAccessResult is not null)
        {
            return verifiedAccessResult;
        }

        var message = await _messageService.SendMessageAsync(matchId, senderId, request);
        return Ok(message);
    }

    private async Task<IActionResult?> CheckVerifiedStudentAccess(Guid studentId)
    {
        var student = await _db.Students.FindAsync(studentId);

        if (student is null)
        {
            return Unauthorized();
        }

        if (!student.IsVerified)
        {
            return StatusCode(403, "Student account is not verified yet.");
        }

        return null;
    }
}
