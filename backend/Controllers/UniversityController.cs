using backend.Models;
using backend.Requests.Universities;
using backend.Responses.Errors;
using backend.Responses.Universities;
using backend.Services.Universities;
using backend.Validators.Universities;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("/universities")]
public class UniversityController : ControllerBase
{
    private readonly IUniversityService _universityService;

    public UniversityController(IUniversityService universityService)
    {
        _universityService = universityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUniversities()
    {
        var universities = await _universityService.GetAll();
        var response = universities.Select((uni) => ToFullUniversityResponse(uni));

        return Ok(response);
    }

    [HttpGet("{id}")]
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

    [HttpPost]
    public async Task<IActionResult> CreateNewUniversity(CreateUniversityRequest request)
    {
        var errors = UniversityValidator.ValidateCreate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }
        var uni = await _universityService.Create(request);
        var response = ToFullUniversityResponse(uni);

        return Created($"/universities/{uni.Id}", response);
    }

    private static UniversityResponse ToFullUniversityResponse(University university)
    {
        return new UniversityResponse(
            university.Id,
            university.Name,
            university.Branch,
            university.CreatedAt
        );
    }
}
