using backend.Data;
using backend.Models;
using backend.Requests.ItemMatches;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Controllers;

[ApiController]
[Route("n8n/matching")]
public class N8nMatchingController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public N8nMatchingController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    private bool IsValidN8nRequest()
    {
        var secretFromHeader = Request.Headers["x-n8n-secret"].ToString();
        var realSecret = _config["N8n:Secret"];

        return !string.IsNullOrWhiteSpace(realSecret)
            && secretFromHeader == realSecret;
    }

    [HttpGet("candidates")]
    public async Task<IActionResult> GetCandidates([FromQuery] string type, [FromQuery] Guid itemId)// [FromQuery] string type, [FromQuery] Guid itemId . Take the value from the URL query string. example endpoint : GET /n8n/matching/candidates?type=lost&itemId=019e7999-750a-7647-8413-622f5a23cb2a
    {
        if (!IsValidN8nRequest())
        {
            return Unauthorized(new { message = "Invalid n8n secret." });
        }

        var normalizedType = type?.Trim().ToLowerInvariant();

        if (normalizedType == "lost")
        {
            var lostItem = await _db.LostItems
                .Include(l => l.Category)
                .Include(l => l.Student)
                .FirstOrDefaultAsync(l => l.Id == itemId);

            if (lostItem is null)
            {
                return NotFound(new { message = "Lost item not found." });
            }

            var startDate = lostItem.LostDate.AddDays(-7);
            var endDate = lostItem.LostDate.AddDays(7);

            var candidates = await _db.FoundItems
                .Include(f => f.Category)
                .Include(f => f.Student)
                .Where(f => f.Student.UniversityId == lostItem.Student.UniversityId)
                .Where(f => f.Status.ToLower() == "open")
                .Where(f => f.CategoryId == lostItem.CategoryId)
                .Where(f => f.StudentId != lostItem.StudentId)
                .Where(f => f.FoundDate >= startDate && f.FoundDate <= endDate)
                .OrderByDescending(f => f.CreatedAt)
                .Take(20)
                .Select(f => new
                {
                    itemId = f.Id,
                    studentId = f.StudentId,
                    type = "found",
                    categoryId = f.CategoryId,
                    categoryName = f.Category.Name,
                    itemName = f.ItemName,
                    description = f.Description,
                    color = f.Color,
                    location = f.Location,
                    date = f.FoundDate,
                    imageUrl = f.ImageUrl
                })
                .ToListAsync();

            return Ok(new
            {
                newItem = new
                {
                    itemId = lostItem.Id,
                    studentId = lostItem.StudentId,
                    type = "lost",
                    categoryId = lostItem.CategoryId,
                    categoryName = lostItem.Category.Name,
                    itemName = lostItem.ItemName,
                    description = lostItem.Description,
                    color = lostItem.Color,
                    location = lostItem.Location,
                    date = lostItem.LostDate,
                    imageUrl = lostItem.ImageUrl
                },
                candidates
            });
        }

        if (normalizedType == "found")
        {
            var foundItem = await _db.FoundItems
                .Include(f => f.Category)
                .Include(f => f.Student)
                .FirstOrDefaultAsync(f => f.Id == itemId);

            if (foundItem is null)
            {
                return NotFound(new { message = "Found item not found." });
            }

            var startDate = foundItem.FoundDate.AddDays(-7);
            var endDate = foundItem.FoundDate.AddDays(7);

            var candidates = await _db.LostItems
                .Include(l => l.Category)
                .Include(l => l.Student)
                .Where(l => l.Student.UniversityId == foundItem.Student.UniversityId)
                .Where(l => l.Status.ToLower() == "open")
                .Where(l => l.CategoryId == foundItem.CategoryId)
                .Where(l => l.StudentId != foundItem.StudentId)
                .Where(l => l.LostDate >= startDate && l.LostDate <= endDate)
                .OrderByDescending(l => l.CreatedAt)
                .Take(20)
                .Select(l => new
                {
                    itemId = l.Id,
                    studentId = l.StudentId,
                    type = "lost",
                    categoryId = l.CategoryId,
                    categoryName = l.Category.Name,
                    itemName = l.ItemName,
                    description = l.Description,
                    color = l.Color,
                    location = l.Location,
                    date = l.LostDate,
                    imageUrl = l.ImageUrl
                })
                .ToListAsync();

            return Ok(new
            {
                newItem = new
                {
                    itemId = foundItem.Id,
                    studentId = foundItem.StudentId,
                    type = "found",
                    categoryId = foundItem.CategoryId,
                    categoryName = foundItem.Category.Name,
                    itemName = foundItem.ItemName,
                    description = foundItem.Description,
                    color = foundItem.Color,
                    location = foundItem.Location,
                    date = foundItem.FoundDate,
                    imageUrl = foundItem.ImageUrl
                },
                candidates
            });
        }

        return BadRequest(new { message = "Invalid type. Use lost or found." });
    }

    [HttpPost("save-match")]
    public async Task<IActionResult> SaveAiMatch(CreateAiMatchRequest request)
    {
        if (!IsValidN8nRequest())
        {
            return Unauthorized(new { message = "Invalid n8n secret." });
        }

        if (request.MatchPercentage is < 0 or > 100)
        {
            return BadRequest(new { message = "Match percentage must be between 0 and 100." });
        }

        if (string.IsNullOrWhiteSpace(request.ConfidenceLevel))
        {
            return BadRequest(new { message = "Confidence level is required." });
        }

        if (string.IsNullOrWhiteSpace(request.ReasoningSummary))
        {
            return BadRequest(new { message = "Reasoning summary is required." });
        }

        var lostItem = await _db.LostItems
            .AsNoTracking() //EF Core should read the data only, but not track it for changes.
            .FirstOrDefaultAsync(l => l.Id == request.LostItemId);
        var foundItem = await _db.FoundItems
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == request.FoundItemId);

        if (lostItem is null || foundItem is null)
        {
            return BadRequest(new { message = "Lost item or found item does not exist." });
        }

        if (lostItem.StudentId == foundItem.StudentId)
        {
            return BadRequest(new { message = "An item cannot be matched with the same student." });
        }

        if (lostItem.CategoryId != foundItem.CategoryId)
        {
            return BadRequest(new { message = "Matched items must have the same category." });
        }

        var universityIds = await _db.Students
            .Where(student =>
                student.Id == lostItem.StudentId || student.Id == foundItem.StudentId
            )
            .Select(student => student.UniversityId)
            .ToListAsync();

        if (universityIds.Count != 2 || universityIds.Distinct().Count() != 1)
        {
            return BadRequest(new { message = "Matched items must belong to the same university." });
        }

        var alreadyExists = await _db.Matches.AnyAsync(m =>
            m.LostItemId == request.LostItemId &&
            m.FoundItemId == request.FoundItemId
        );

        if (alreadyExists)
        {
            return Ok(new
            {
                success = true,
                message = "Match already exists."
            });
        }

        var match = new ItemsMatch
        {
            Id = Guid.NewGuid(),
            LostItemId = request.LostItemId,
            FoundItemId = request.FoundItemId,
            MatchPercentage = request.MatchPercentage,
            ConfidenceLevel = request.ConfidenceLevel.Trim(),
            ReasoningSummary = request.ReasoningSummary.Trim(),
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _db.Matches.Add(match);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
            when (exception.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation
            })
        {
            return Ok(new
            {
                success = true,
                message = "Match already exists."
            });
        }

        return Ok(new
        {
            success = true,
            matchId = match.Id
        });
    }
}
