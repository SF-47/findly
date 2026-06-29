using System.Security.Claims;
using backend.Data;
using backend.Requests.ItemMatches;
using backend.Responses.ItemMatches;
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

    public MatchesController(AppDbContext db)
    {
        _db = db;
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

        var match = await matches.FirstOrDefaultAsync(match => match.Id == id);
        if (match is null)
        {
            return NotFound(new { message = "Match not found." });
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
