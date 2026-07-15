using System.Security.Claims;
using backend.Models;
using backend.Data;
using backend.Requests.ItemMatches;
using backend.Responses.ItemMatches;
using backend.Services.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

// ! ADMIN PANEL ONLY
[Authorize]
[ApiController]
[Route("matches")]
public class MatchesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly INotificationService _notificationService;

    public MatchesController(AppDbContext db, INotificationService notificationService)
    {
        _db = db;
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMatches()
    {
        var matches = GetAccessibleMatches();
        if (matches is null)
        {
            return Forbid();
        }

        var response = await matches
            .AsNoTracking()
            .OrderByDescending(match => match.CreatedAt)
            .Select(match => new ItemsMatchResponse(
                match.Id,
                new MatchItemResponse(
                    match.LostItem.Id,
                    match.LostItem.StudentId,
                    match.LostItem.Student.FullName,
                    match.LostItem.Student.University!.ShortName,
                    match.LostItem.Student.University.FullName,
                    match.LostItem.Student.University.Branch,
                    match.LostItem.Category.Name,
                    match.LostItem.ItemName,
                    match.LostItem.Description,
                    match.LostItem.Color,
                    match.LostItem.Location,
                    match.LostItem.LostDate,
                    match.LostItem.ImageUrl
                ),
                new MatchItemResponse(
                    match.FoundItem.Id,
                    match.FoundItem.StudentId,
                    match.FoundItem.Student.FullName,
                    match.FoundItem.Student.University!.ShortName,
                    match.FoundItem.Student.University.FullName,
                    match.FoundItem.Student.University.Branch,
                    match.FoundItem.Category.Name,
                    match.FoundItem.ItemName,
                    match.FoundItem.Description,
                    match.FoundItem.Color,
                    match.FoundItem.Location,
                    match.FoundItem.FoundDate,
                    match.FoundItem.ImageUrl
                ),
                match.MatchPercentage,
                match.ConfidenceLevel,
                match.ReasoningSummary,
                match.Status,
                match.CreatedAt,
                match.ReviewedAt
            ))
            .ToListAsync();

        return Ok(response);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateMatchStatus(Guid id, UpdateMatchStatusRequest request)
    {
        var normalizedStatus = request.Status?.Trim().ToLowerInvariant();
        var status = normalizedStatus switch
        {
            "pending" => "Pending",
            "confirmed" => "Confirmed",
            "rejected" => "Rejected",
            _ => null,
        };

        if (status is null)
        {
            return BadRequest(new { message = "Status must be pending, confirmed, or rejected." });
        }

        var matches = GetAccessibleMatches();
        if (matches is null)
        {
            return Forbid();
        }

        // Eagerly load the items and the students connected to them
        var match = await matches
            .Include(m => m.LostItem)
                .ThenInclude(l => l.Student)
            .Include(m => m.FoundItem)
                .ThenInclude(f => f.Student)
            .FirstOrDefaultAsync(match => match.Id == id);

        if (match is null)
            return NotFound(new { message = "Match not found." });

        // Track if it was confirmed so we don't send duplicate notifications
        var wasAlreadyConfirmed = match.Status == "Confirmed";

        // ... existing assignment and saving logic ...
        match.Status = status;
        await _db.SaveChangesAsync();

        // Check if it was just confirmed
        if (status == "Confirmed" && !wasAlreadyConfirmed)
        {
            var lostStudentPushToken = match.LostItem?.Student?.ExpoPushToken;
            var foundStudentPushToken = match.FoundItem?.Student?.ExpoPushToken;

            // 1. Lost Item Student
            if (!string.IsNullOrWhiteSpace(lostStudentPushToken))
            {
                await _notificationService.SendPushNotificationAsync(
                    lostStudentPushToken,
                    "Match Confirmed!",
                    "We found a match for your lost item.",
                    new { matchId = match.Id }
                );
            }
            var lostNotif = new Notification
            {
                StudentId = match.LostItem!.StudentId,
                Title = "Match Confirmed!",
                Message = $"We found a match for your lost '{match.LostItem.ItemName}'.",
                Type = "Match",
            };
            _db.Notifications.Add(lostNotif);

            // 2. Found Item Student
            if (!string.IsNullOrWhiteSpace(foundStudentPushToken))
            {
                await _notificationService.SendPushNotificationAsync(
                    foundStudentPushToken,
                    "Match Confirmed!",
                    "The item you found has been matched.",
                    new { matchId = match.Id }
                );
            }
            var foundNotif = new Notification
            {
                StudentId = match.FoundItem!.StudentId,
                Title = "Match Confirmed!",
                Message = $"The item '{match.FoundItem.ItemName}' you found has been matched.",
                Type = "Match",
            };
            _db.Notifications.Add(foundNotif);
        }

        var adminIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(adminIdValue, out var adminId))
        {
            return Forbid();
        }

        match.Status = status;
        match.ReviewedAt = status == "Pending" ? null : DateTime.UtcNow;
        match.ReviewedByAdminId = status == "Pending" ? null : adminId;

        await _db.SaveChangesAsync();

        return Ok(
            new
            {
                match.Id,
                match.Status,
                match.ReviewedAt,
            }
        );
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMatch(Guid id)
    {
        var matches = GetAccessibleMatches();
        if (matches is null)
        {
            return Forbid();
        }

        var match = await matches.FirstOrDefaultAsync(match => match.Id == id);
        if (match is null)
        {
            return NotFound(new { message = "Match not found." });
        }

        _db.Matches.Remove(match);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private IQueryable<ItemsMatch>? GetAccessibleMatches()
    {
        var matches = _db.Matches.AsQueryable();

        if (User.IsInRole("Owner"))
        {
            return matches;
        }

        if (!User.IsInRole("UniversityAdmin"))
        {
            return null;
        }

        var universityId = GetAdminUniversityId();
        if (universityId is null)
        {
            return null;
        }

        return matches.Where(match =>
            match.LostItem.Student.UniversityId == universityId
            && match.FoundItem.Student.UniversityId == universityId
        );
    }

    private Guid? GetAdminUniversityId()
    {
        var universityIdValue = User.FindFirst("universityId")?.Value;

        return Guid.TryParse(universityIdValue, out var universityId) ? universityId : null;
    }
}
