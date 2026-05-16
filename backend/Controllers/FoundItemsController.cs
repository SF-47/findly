using backend.Models;
using backend.Requests.FoundItems;
using backend.Responses.Errors;
using backend.Responses.FoundItems;
using backend.Services.FoundItems;
using backend.Validators.FoundItems;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("found-items")]
public class FoundItemsService : ControllerBase
{
    private readonly IFoundItemService _foundItemsService;

    public FoundItemsService(IFoundItemService foundItemsServices)
    {
        _foundItemsService = foundItemsServices;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllfoundItems()
    {
        var foundItems = await _foundItemsService.GetAll();
        var response = foundItems.Select(foundItem => ToFullResponse(foundItem));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetfoundItemById(int id)
    {
        var foundItem = await _foundItemsService.GetById(id);
        if (foundItem is null)
        {
            return NotFound("No Item found");
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

        var response = ToFullResponse(foundItem);
        return Created($"/found-items/{foundItem.Id}", response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatefoundItem(int id, UpdateFoundItemRequest request)
    {
        var errors = FoundItemsValidator.ValidateUpdate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
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
    public async Task<IActionResult> DeleteFoundItem(int id)
    {
        var result = await _foundItemsService.Delete(id);
        if (!result)
        {
            return NotFound("Item not found");
        }
        return NoContent();
    }

    private static FullFoundItemsResponse ToFullResponse(FoundItem foundItem)
    {
        return new FullFoundItemsResponse(
            foundItem.Id,
            foundItem.StudentId,
            foundItem.CategoryId,
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
}
