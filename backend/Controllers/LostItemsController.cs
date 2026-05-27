using backend.Models;
using backend.Requests.LostItems;
using backend.Responses.Errors;
using backend.Responses.LostItems;
using backend.Services.LostItems;
using backend.Validators.LostItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("lost-items")]
public class LostItemsController : ControllerBase
{
    private readonly ILostItemsService _lostItemsService;

    public LostItemsController(ILostItemsService lostItemsService)
    {
        _lostItemsService = lostItemsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllLostItems()
    {
        var lostItems = new List<LostItem>();

        if (IsOwner())
        {
            lostItems = await _lostItemsService.GetAll();
        }
        else if (IsUniversityAdmin())
        {
            var adminUniId = GetAdminUniversityId();
            if (adminUniId is null)
            {
                return Forbid();
            }
            lostItems = await _lostItemsService.GetAllByUniversityId(adminUniId.Value);
        }
        else
        {
            return Forbid();
        }

        var response = lostItems.Select(ToFullResponse);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLostItemById(Guid id)
    {
        var lostItem = await _lostItemsService.GetById(id);
        if (lostItem is null)
        {
            return NotFound("No Item found");
        }

        var accessResult = CheckItemAccess(lostItem);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var response = ToFullResponse(lostItem);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateNewLostItem(CreateLostItemRequest request)
    {
        var errors = LostItemsValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var studentExists = await _lostItemsService.StudentExists(request.StudentId);
        if (!studentExists)
        {
            var errorResponse = new ErrorResponse(
                "Validation failed",
                new List<string> { "Student does not exist." }
            );
            return BadRequest(errorResponse);
        }

        var accessResult = await CheckItemCreateAccess(request.StudentId);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var categoryExists = await _lostItemsService.CategoryExists(request.CategoryId);
        if (!categoryExists)
        {
            var errorResponse = new ErrorResponse(
                "Validation failed",
                new List<string> { "Category does not exist." }
            );
            return BadRequest(errorResponse);
        }
        var lostItem = await _lostItemsService.Create(request);

        var response = ToFullResponse(lostItem);
        return Created($"/lost-items/{lostItem.Id}", response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLostItem(Guid id, UpdateLostItemRequest request)
    {
        var errors = LostItemsValidator.ValidateUpdate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var existingLostItem = await _lostItemsService.GetById(id);
        if (existingLostItem is null)
        {
            return NotFound("Item not found");
        }

        var accessResult = CheckItemAccess(existingLostItem);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var categoryExists = await _lostItemsService.CategoryExists(request.CategoryId);
        if (!categoryExists)
        {
            var errorResponse = new ErrorResponse(
                "Validation failed",
                new List<string> { "Category does not exist." }
            );
            return BadRequest(errorResponse);
        }

        var lostItem = await _lostItemsService.Update(id, request);
        if (lostItem is null)
        {
            return NotFound("Item not found");
        }

        var response = ToFullResponse(lostItem);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLostItem(Guid id)
    {
        var lostItem = await _lostItemsService.GetById(id);
        if (lostItem is null)
        {
            return NotFound("Item not found");
        }

        var accessResult = CheckItemAccess(lostItem);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var result = await _lostItemsService.Delete(id);
        if (!result)
        {
            return NotFound("Item not found");
        }
        return NoContent();
    }

    private bool IsOwner()
    {
        return User.IsInRole("Owner");
    }

    private bool IsUniversityAdmin()
    {
        return User.IsInRole("UniversityAdmin");
    }

    private Guid? GetAdminUniversityId()
    {
        var universityIdValue = User.FindFirst("universityId")?.Value;
        if (string.IsNullOrWhiteSpace(universityIdValue))
        {
            return null;
        }
        if (!Guid.TryParse(universityIdValue, out var universityId))
        {
            return null;
        }
        return universityId;
    }

    private static FullLostItemsResponse ToFullResponse(LostItem lostItem)
    {
        return new FullLostItemsResponse(
            lostItem.Id,
            lostItem.StudentId,
            lostItem.Student?.FullName ?? "Unknown student",
            lostItem.Student?.University?.ShortName ?? "Unknown university",
            lostItem.Student?.University?.Branch ?? "Unknown branch",
            lostItem.CategoryId,
            lostItem.Category?.Name ?? "Unknown category",
            lostItem.ItemName,
            lostItem.Description,
            lostItem.Color,
            lostItem.Location,
            lostItem.LostDate,
            lostItem.ImageUrl,
            lostItem.Status,
            lostItem.CreatedAt
        );
    }

    private IActionResult? CheckItemAccess(LostItem lostItem)
    {
        if (IsOwner())
        {
            return null;
        }
        if (IsUniversityAdmin())
        {
            var adminUniversityId = GetAdminUniversityId();
            if (adminUniversityId is null)
            {
                return Forbid();
            }

            if (lostItem?.Student?.UniversityId != adminUniversityId)
            {
                return Forbid();
            }

            return null;
        }

        return Forbid();
    }

    private async Task<IActionResult?> CheckItemCreateAccess(Guid requestStudentId)
    {
        if (IsOwner())
        {
            return null;
        }
        if (IsUniversityAdmin())
        {
            var adminUniId = GetAdminUniversityId();
            if (adminUniId is null)
            {
                return Forbid();
            }
            var universityIdOfStudent = await _lostItemsService.GetUniversityIdFromStudentId(
                requestStudentId
            );
            if (universityIdOfStudent is null)
            {
                return Forbid();
            }
            if (universityIdOfStudent != adminUniId)
            {
                return Forbid();
            }

            return null;
        }
        return Forbid();
    }
}
