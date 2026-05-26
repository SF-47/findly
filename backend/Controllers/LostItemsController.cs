using backend.Models;
using backend.Requests.LostItems;
using backend.Responses.Errors;
using backend.Responses.LostItems;
using backend.Services.LostItems;
using backend.Validators.LostItems;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

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
        var lostItems = await _lostItemsService.GetAll();
        var response = lostItems.Select(lostItem => ToFullResponse(lostItem));

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
        var result = await _lostItemsService.Delete(id);
        if (!result)
        {
            return NotFound("Item not found");
        }
        return NoContent();
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
}
