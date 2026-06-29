using backend.Models;
using backend.Requests.Universities;
using backend.Responses.Errors;
using backend.Responses.Universities;
using backend.Services.Universities;
using backend.Validators.Universities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
[ApiController]
[Route("universities")]
public class UniversityController : ControllerBase
{
    private readonly IUniversityService _universityService;

    public UniversityController(IUniversityService universityService)
    {
        _universityService = universityService;
    }

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    [HttpGet]
    public async Task<IActionResult> GetAllUniversities()
    {
        var universities = await _universityService.GetAll();

        var response = universities.Select(ToFullUniversityResponse);

        return Ok(response);
    }

    // ! ADMIN PANEL ONLY
    [Authorize(Roles = "Owner")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetUniById(Guid id)
    {
        var university = await _universityService.GetById(id);

        if (university is null)
        {
            return NotFound();
        }

        var response = ToFullUniversityResponse(university);

        return Ok(response);
    }

    // ! ADMIN PANEL ONLY
    [Authorize(Roles = "Owner")]
    [HttpPost]
    public async Task<IActionResult> CreateNewUniversity(CreateUniversityRequest request)
    {
        var errors = UniversityValidator.ValidateCreate(request);

        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }

        var alreadyExists = await _universityService.ExistsByShortNameFullNameAndBranch(
            request.ShortName,
            request.FullName,
            request.Branch
        );

        if (alreadyExists)
        {
            var errorResponse = new ErrorResponse(
                "University already exists.",
                new List<string>
                {
                    "A university with the same short name, full name, and branch already exists.",
                }
            );

            return Conflict(errorResponse);
        }

        var university = await _universityService.Create(request);

        var response = ToFullUniversityResponse(university);

        return Created($"/universities/{university.Id}", response);
    }

    // ! ADMIN PANEL ONLY
    [Authorize(Roles = "Owner")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUniversity(Guid id, UpdateUniversityRequest request)
    {
        var errors = UniversityValidator.ValidateUpdate(request);

        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }

        var alreadyExists = await _universityService.ExistsByShortNameFullNameAndBranchExceptId(
            id,
            request.ShortName,
            request.FullName,
            request.Branch
        );

        if (alreadyExists)
        {
            var errorResponse = new ErrorResponse(
                "University already exists.",
                new List<string>
                {
                    "Another university with the same short name, full name, and branch already exists.",
                }
            );

            return Conflict(errorResponse);
        }

        var university = await _universityService.Update(id, request);

        if (university is null)
        {
            return NotFound();
        }

        var response = ToFullUniversityResponse(university);

        return Ok(response);
    }

    // ! ADMIN PANEL ONLY
    [Authorize(Roles = "Owner")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUniversity(Guid id)
    {
        var deleted = await _universityService.Delete(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private static UniversityResponse ToFullUniversityResponse(University university)
    {
        return new UniversityResponse(
            university.Id,
            university.ShortName,
            university.FullName,
            university.Branch,
            university.CreatedAt
        );
    }
}
