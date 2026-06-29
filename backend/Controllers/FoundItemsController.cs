using backend.Models;
using backend.Requests.FoundItems;
using backend.Responses.Errors;
using backend.Responses.FoundItems;
using backend.Services.FoundItems;
using backend.Services.N8n;
using backend.Validators.FoundItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// ! ADMIN PANEL ONLY
[Authorize]
[ApiController]
[Route("found-items")]
public class FoundItemsController : ControllerBase
{
    private readonly IFoundItemService _foundItemsService;
    private readonly IN8nMatchingService _n8nMatchingService;

    public FoundItemsController(
        IFoundItemService foundItemsService,
        IN8nMatchingService n8nMatchingService
    )
    {
        _foundItemsService = foundItemsService;
        _n8nMatchingService = n8nMatchingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllfoundItems()
    {
        var foundItems = new List<FoundItem>();

        if (IsOwner())
        {
            foundItems = await _foundItemsService.GetAll();
        }
        else if (IsUniversityAdmin())
        {
            var adminUniId = GetAdminUniversityId();
            if (adminUniId is null)
            {
                return Forbid();
            }
            foundItems = await _foundItemsService.GetAllByUniversityId(adminUniId.Value);
        }
        else
        {
            return Forbid();
        }

        var response = foundItems.Select(foundItem => ToFullResponse(foundItem));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetfoundItemById(Guid id)
    {
        var foundItem = await _foundItemsService.GetById(id);
        if (foundItem is null)
        {
            return NotFound("No Item found");
        }

        var accessResult = CheckItemAccess(foundItem);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var response = ToFullResponse(foundItem);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateNewfoundItem(CreateFoundItemRequest request)
    {
        var errors = FoundItemsValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var studentExists = await _foundItemsService.StudentExists(request.StudentId);
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

        var categoryExists = await _foundItemsService.CategoryExists(request.CategoryId);
        if (!categoryExists)
        {
            var errorResponse = new ErrorResponse(
                "Validation failed",
                new List<string> { "Category does not exist." }
            );
            return BadRequest(errorResponse);
        }
        var foundItem = await _foundItemsService.Create(request);
        await _n8nMatchingService.TriggerMatchingAsync(foundItem.Id, "found");

        var response = ToFullResponse(foundItem);
        return Created($"/found-items/{foundItem.Id}", response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatefoundItem(Guid id, UpdateFoundItemRequest request)
    {
        var errors = FoundItemsValidator.ValidateUpdate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var existingFoundItem = await _foundItemsService.GetById(id);
        if (existingFoundItem is null)
        {
            return NotFound("Item not found");
        }

        var accessResult = CheckItemAccess(existingFoundItem);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var categoryExists = await _foundItemsService.CategoryExists(request.CategoryId);
        if (!categoryExists)
        {
            var errorResponse = new ErrorResponse(
                "Validation failed",
                new List<string> { "Category does not exist." }
            );
            return BadRequest(errorResponse);
        }

        var foundItem = await _foundItemsService.Update(id, request);
        if (foundItem is null)
        {
            return NotFound("Item not found");
        }

        var response = ToFullResponse(foundItem);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFoundItem(Guid id)
    {
        var foundItem = await _foundItemsService.GetById(id);
        if (foundItem is null)
        {
            return NotFound("Item not found");
        }

        var accessResult = CheckItemAccess(foundItem);
        if (accessResult is not null)
        {
            return accessResult;
        }

        var result = await _foundItemsService.Delete(id);
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

    private static FullFoundItemsResponse ToFullResponse(FoundItem foundItem)
    {
        return new FullFoundItemsResponse(
            foundItem.Id,
            foundItem.StudentId,
            foundItem.Student?.FullName ?? "Unknown student",
            foundItem.Student?.University?.ShortName ?? "Unknown university",
            foundItem.Student?.University?.Branch ?? "Unknown branch",
            foundItem.CategoryId,
            foundItem.Category?.Name ?? "Unknown category",
            foundItem.ItemName,
            foundItem.Description,
            foundItem.Color,
            foundItem.Location,
            foundItem.FoundDate,
            foundItem.ImageUrl,
            foundItem.Status,
            foundItem.CreatedAt
        );
    }

    private IActionResult? CheckItemAccess(FoundItem foundItem)
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

            if (foundItem?.Student?.UniversityId != adminUniversityId)
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
            var universityIdOfStudent = await _foundItemsService.GetUniversityIdFromStudentId(
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
