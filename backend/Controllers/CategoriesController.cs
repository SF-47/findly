using System.Formats.Asn1;
using backend.Models;
using backend.Requests.Categories;
using backend.Responses.Categories;
using backend.Responses.Errors;
using backend.Services.Categories;
using backend.Validators.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;   
    
    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories() //Task<IActionResult> means that : This method returns an HTTP response.
    {
        var categories = await _categoryService.GetAll();

        var response = categories.Select(category => ToCategoryResponse(category));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        var category = await _categoryService.GetById(id);
        if (category is null)
        {
            return NotFound();
        }

        var response = ToCategoryResponse(category);
        return Ok(response);
    }
    [Authorize(Roles = "Owner")]
    [HttpPost]
    public async Task<IActionResult> CreateNewCategory(CreateCategoryRequest request)
    {
        var errors = CategoryValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var exists = await _categoryService.CategoryNameExists(request.Name);
        if (exists)
        {
            errors.Add("Category name already exists.");
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var category = await _categoryService.Create(request);

        var response = ToCategoryResponse(category);
        return Created($"/categories/{category.Id}", response);
    }
    [Authorize(Roles = "Owner")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryRequest request)
    {
        var errors = CategoryValidator.ValidateUpdate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var exists = await _categoryService.CategoryNameExistsExceptId(id , request.Name);
        if (exists)
        {
            errors.Add("Category name already exists.");
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var category = await _categoryService.Update(id, request);
        if (category is null)
        {
            return NotFound();
        }

        var response = ToCategoryResponse(category);
        return Ok(response);
    }
    [Authorize(Roles = "Owner")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await _categoryService.Delete(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    private static CategoryResponse ToCategoryResponse(Category category)
    {
        return new CategoryResponse(category.Id, category.Name, category.Description);
    }

    private static CategoryResponseName ToCategoryResponseName(Category category)
    {
        return new CategoryResponseName(category.Name);
    }
}
