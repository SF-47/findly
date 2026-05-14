using backend.Models;
using backend.Requests.Students;
using backend.Responses.Errors;
using backend.Responses.Students;
using backend.Services.Students;
using backend.Validators.Students;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("students")]
public class StudentController : ControllerBase
{
    private readonly IStudentServices _studentService;

    public StudentController(IStudentServices studentServices)
    {
        _studentService = studentServices;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _studentService.GetAll();

        var response = students.Select(student => ToFullStudentResponse(student));
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudentById(int id)
    {
        var student = await _studentService.GetById(id);
        if (student is null)
        {
            return NotFound("Student not found.");
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
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }
        var uniIdExists = await _studentService.UniIdExists(request.UniversityId);
        if (uniIdExists)
        {
            errors.Add("University ID is already used.");
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }
        var emailExists = await _studentService.EmailExists(request.Email);
        if (emailExists)
        {
            errors.Add("Email is already used.");
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }
        var phoneNbExists = await _studentService.PhoneNbExists(request.PhoneNumber);
        if (phoneNbExists)
        {
            errors.Add("Phone number is already used.");
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }

        var student = await _studentService.Create(request);

        var response = ToFullStudentResponse(student);

        return Created($"/students/{student.Id}", response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, UpdateStudentRequest request)
    {
        var errors = StudentValidator.ValidateUpdate(request);
        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }

        var student = await _studentService.Update(id, request);
        if (student is null)
        {
            return NotFound();
        }
        var emailExists = await _studentService.EmailExistsForAnotherStudent(
            student.Email,
            student.Id
        );
        if (emailExists)
        {
            errors.Add("Email is already used.");
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }
        var uniIdExists = await _studentService.UniIdExistsForAnotherStudent(
            student.UniversityId,
            student.Id
        );
        if (uniIdExists)
        {
            errors.Add("University ID is already used.");
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }
        var phoneNbExists = await _studentService.PhoneNbExistsForAnotherStudent(
            student.PhoneNumber,
            student.Id
        );
        if (phoneNbExists)
        {
            errors.Add("Phone number is already used.");
            var errorResponse = new ErrorResponse("Validation failed.", errors);
            return BadRequest(errorResponse);
        }

        var response = ToFullStudentResponse(student);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var result = await _studentService.Delete(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    private static FullStudentResponse ToFullStudentResponse(Student student)
    {
        return new FullStudentResponse(
            student.Id,
            student.FullName,
            student.Email,
            student.UniversityId,
            student.PhoneNumber,
            student.UniversityCardImageUrl,
            student.IsVerified,
            student.CreatedAt
        );
    }
}
