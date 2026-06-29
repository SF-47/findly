using System.Security.Claims;
using backend.Models;
using backend.Requests.FoundItems;
using backend.Requests.LostItems;
using backend.Requests.Students;
using backend.Responses.Errors;
using backend.Responses.FoundItems;
using backend.Responses.LostItems;
using backend.Responses.Students;
using backend.Services.FoundItems;
using backend.Services.LostItems;
using backend.Services.N8n;
using backend.Services.Students;
using backend.Validators.FoundItems;
using backend.Validators.LostItems;
using backend.Validators.Students;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("students")]
public class StudentController : ControllerBase
{
    private readonly IStudentServices _studentService;
    private readonly ILostItemsService _lostItemsService;
    private readonly IFoundItemService _foundItemsService;
    private readonly IN8nMatchingService _n8nMatchingService;

    public StudentController(
        IStudentServices studentServices,
        ILostItemsService lostItemsService,
        IFoundItemService foundItemService,
        IN8nMatchingService n8nMatchingService
    )
    {
        _studentService = studentServices;
        _lostItemsService = lostItemsService;
        _foundItemsService = foundItemService;
        _n8nMatchingService = n8nMatchingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllStudents()
    {
        List<Student> students;

        if (IsOwner())
        {
            students = await _studentService.GetAll();
        }
        else if (IsUniversityAdmin())
        {
            var adminUniversityId = GetAdminUniversityId();

            if (adminUniversityId is null)
            {
                return Forbid();
            }

            students = await _studentService.GetByUniversityId(adminUniversityId.Value);
        }
        else
        {
            return Forbid();
        }

        var response = students.Select(ToFullStudentResponse);

        return Ok(response);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentStudent()
    {
        var studentIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(studentIdValue, out var studentId)) //The ID inside the token is text. This converts it to Guid
        {
            return Unauthorized(); //If the token is invalid, return Unauthorized
        }

        var student = await _studentService.GetCurrentStudent(studentId);
        if (student is null)
        {
            return NotFound("Student not found.");
        }

        var response = ToFullStudentResponse(student);

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetStudentById(Guid id)
    {
        var student = await _studentService.GetById(id);

        if (student is null)
        {
            return NotFound("Student not found.");
        }

        var accessResult = CheckStudentAccess(student);

        if (accessResult is not null)
        {
            return accessResult;
        }

        var response = ToFullStudentResponse(student);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateNewStudent(CreateStudentRequest request)
    {
        var errors = StudentValidator.ValidateCreate(request);

        if (errors.Count > 0)
        {
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var requestAccessResult = CheckRequestUniversityAccess(request.UniversityId);

        if (requestAccessResult is not null)
        {
            return requestAccessResult;
        }

        var universityExists = await _studentService.UniversityExists(request.UniversityId);

        if (!universityExists)
        {
            errors.Add("University doesn't exist.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var universityStudentIdExists = await _studentService.UniversityStudentIdExists(
            request.UniversityId,
            request.UniversityStudentId
        );

        if (universityStudentIdExists)
        {
            errors.Add("This university student ID is already used in this university.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var emailExists = await _studentService.EmailExists(request.Email);

        if (emailExists)
        {
            errors.Add("Email is already used.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var phoneNbExists = await _studentService.PhoneNbExists(request.PhoneNumber);

        if (phoneNbExists)
        {
            errors.Add("Phone number is already used.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var student = await _studentService.Create(request);

        var response = ToFullStudentResponse(student);

        return Created($"/students/{student.Id}", response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(Guid id, UpdateStudentRequest request)
    {
        var errors = StudentValidator.ValidateUpdate(request);

        if (errors.Count > 0)
        {
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var existingStudent = await _studentService.GetById(id);

        if (existingStudent is null)
        {
            return NotFound("Student not found.");
        }

        var studentAccessResult = CheckStudentAccess(existingStudent);

        if (studentAccessResult is not null)
        {
            return studentAccessResult;
        }

        var requestAccessResult = CheckRequestUniversityAccess(request.UniversityId);

        if (requestAccessResult is not null)
        {
            return requestAccessResult;
        }

        var universityExists = await _studentService.UniversityExists(request.UniversityId);

        if (!universityExists)
        {
            errors.Add("University doesn't exist.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var universityStudentIdExists =
            await _studentService.UniversityStudentIdExistsForAnotherStudent(
                request.UniversityId,
                request.UniversityStudentId,
                id
            );

        if (universityStudentIdExists)
        {
            errors.Add("This university student ID is already used in this university.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var emailExists = await _studentService.EmailExistsForAnotherStudent(request.Email, id);

        if (emailExists)
        {
            errors.Add("Email is already used.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var phoneNbExists = await _studentService.PhoneNbExistsForAnotherStudent(
            request.PhoneNumber,
            id
        );

        if (phoneNbExists)
        {
            errors.Add("Phone number is already used.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var student = await _studentService.Update(id, request);

        if (student is null)
        {
            return NotFound("Student not found.");
        }

        var response = ToFullStudentResponse(student);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(Guid id)
    {
        var student = await _studentService.GetById(id);

        if (student is null)
        {
            return NotFound("Student not found.");
        }

        var accessResult = CheckStudentAccess(student);

        if (accessResult is not null)
        {
            return accessResult;
        }

        var result = await _studentService.Delete(id);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id}/verify")]
    public async Task<IActionResult> VerifyStudent(Guid id)
    {
        var existingStudent = await _studentService.GetById(id);

        if (existingStudent is null)
        {
            return NotFound("Student not found.");
        }

        var accessResult = CheckStudentAccess(existingStudent);

        if (accessResult is not null)
        {
            return accessResult;
        }

        var student = await _studentService.VerifyStudent(id);

        if (student is null)
        {
            return NotFound("Student not found.");
        }

        return Ok(ToFullStudentResponse(student));
    }

    [Authorize(Roles = "Student")]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateStudentOwnInfo(UpdateStudentOwnInfo request)
    {
        var errors = StudentValidator.ValidateOwnInfoUpdate(request);

        if (errors.Count > 0)
        {
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var studentIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(studentIdValue, out var studentId))
        {
            return Unauthorized();
        }

        var phoneNbExists = await _studentService.PhoneNbExistsForAnotherStudent(
            request.PhoneNumber,
            studentId
        );

        if (phoneNbExists)
        {
            errors.Add("Phone number is already used.");
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var student = await _studentService.UpdateStudentOwnInfo(studentId, request);
        if (student is null)
        {
            return NotFound("Student not found.");
        }

        var response = ToFullStudentResponse(student);
        return Ok(response);
    }

    [Authorize(Roles = "Student")]
    [HttpPost("me/create/lost-items")]
    public async Task<IActionResult> CreateLostItemByStudent(CreateLostItemByStudentRequest request)
    {
        var studentIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(studentIdValue, out var studentId))
        {
            return Unauthorized();
        }

        var errors = LostItemsValidator.ValidateCreateByStudent(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var studentExists = await _studentService.GetCurrentStudent(studentId);
        if (studentExists is null)
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

        var lostItem = await _lostItemsService.CreateLostItemByStudent(studentId, request);
        await _n8nMatchingService.TriggerMatchingAsync(lostItem.Id, "lost");

        var response = ToFullLostResponse(lostItem);
        return Created($"/me/lost-items/{lostItem.Id}", response);
    }

    [Authorize(Roles = "Student")]
    [HttpPost("me/create/found-items")]
    public async Task<IActionResult> CreateFoundItemByStudent(
        CreateFoundItemByStudentRequest request
    )
    {
        var studentIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(studentIdValue, out var studentId))
        {
            return Unauthorized();
        }

        var errors = FoundItemsValidator.ValidateCreateByStudent(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var studentExists = await _studentService.GetCurrentStudent(studentId);
        if (studentExists is null)
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
        var foundItem = await _foundItemsService.CreateFoundItemByStudent(studentId, request);
        await _n8nMatchingService.TriggerMatchingAsync(foundItem.Id, "found");

        var response = ToFullFoundResponse(foundItem);
        return Created($"/me/found-items/{foundItem.Id}", response);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("lost-items")]
    public async Task<IActionResult> GetLostItemsByUniId()
    {
        var uniIdValue = User.FindFirst("universityId")?.Value;
        if (!Guid.TryParse(uniIdValue, out var uniId))
        {
            return Unauthorized();
        }

        var lostItems = await _lostItemsService.GetAllByUniversityId(uniId);

        var response = lostItems.Select(lostItem => ToFullLostResponse(lostItem));
        return Ok(response);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("found-items")]
    public async Task<IActionResult> GetFoundItemsByUniId()
    {
        var uniIdValue = User.FindFirst("universityId")?.Value;
        if (!Guid.TryParse(uniIdValue, out var uniId))
        {
            return Unauthorized();
        }

        var foundItems = await _foundItemsService.GetAllByUniversityId(uniId);

        var response = foundItems.Select(foundItem => ToFullFoundResponse(foundItem));
        return Ok(response);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("me/lost-items")]
    public async Task<IActionResult> GetAllLostItemsCreatedByStudent()
    {
        var studentIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(studentIdValue, out var studentId))
        {
            return Unauthorized();
        }

        var lostItems = await _lostItemsService.GetAllLostItemsCreatedByStudent(studentId);

        var response = lostItems.Select(lostItem => ToFullLostResponse(lostItem));
        return Ok(response);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("me/found-items")]
    public async Task<IActionResult> GetAllFoundItemsCreatedByStudent()
    {
        var studentIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(studentIdValue, out var studentId))
        {
            return Unauthorized();
        }

        var foundItems = await _foundItemsService.GetAllFoundItemsCreatedByStudent(studentId);

        var response = foundItems.Select(foundItem => ToFullFoundResponse(foundItem));
        return Ok(response);
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

    private IActionResult? CheckRequestUniversityAccess(Guid requestUniversityId)
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

            if (requestUniversityId != adminUniversityId.Value)
            {
                return Forbid();
            }

            return null;
        }

        return Forbid();
    }

    private IActionResult? CheckStudentAccess(Student student)
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

            if (student.UniversityId != adminUniversityId.Value)
            {
                return Forbid();
            }

            return null;
        }

        return Forbid();
    }

    private static FullStudentResponse ToFullStudentResponse(Student student)
    {
        return new FullStudentResponse(
            student.Id,
            student.FullName,
            student.Email,
            student.UniversityId,
            student.UniversityStudentId,
            student.University?.ShortName,
            student.University?.FullName,
            student.University?.Branch,
            student.PhoneNumber,
            student.UniversityCardImageUrl,
            student.IsVerified,
            student.CreatedAt
        );
    }

    private static FullLostItemsResponse ToFullLostResponse(LostItem lostItem)
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

    private static FullFoundItemsResponse ToFullFoundResponse(FoundItem foundItem)
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
}
