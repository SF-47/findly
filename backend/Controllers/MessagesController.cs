using System.Security.Claims;
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

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetChatHistory(Guid matchId)
    {
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

        var message = await _messageService.SendMessageAsync(matchId, senderId, request);
        return Ok(message);
    }
}
