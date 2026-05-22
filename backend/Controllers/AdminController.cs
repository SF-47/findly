using backend.Models;
using backend.Requests.Admins;
using backend.Responses.Admins;
using backend.Responses.Errors;
using backend.Services.Admins;
using backend.Validators.Admins;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("admins")]
[Authorize] //This means : admins now requires a valid JWT token.
public class AdminsController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminsController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAdmins()
    {
        var admins = await _adminService.GetAll();

        var response = admins.Select(ToAdminResponse);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAllAdminsExcept(Guid id)
    {
        var admins = await _adminService.GetAllExcept(id);
        var response = admins.Select(ToAdminResponse);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAdmin(CreateAdminRequest request)
    {
        var errors = AdminValidator.ValidateCreate(request);

        if (errors.Count > 0)
        {
            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var emailExists = await _adminService.EmailExists(request.Email);

        if (emailExists)
        {
            errors.Add("Email is already used.");

            return BadRequest(new ErrorResponse("Validation failed.", errors));
        }

        var phoneExists = await _adminService.PhoneExists(request.PhoneNumber);
        if (phoneExists)
        {
            errors.Add("Phone number is already associated to an account.");
            return BadRequest(new ErrorResponse("Validation Error", errors));
        }

        var admin = await _adminService.Create(request);

        var response = ToAdminResponse(admin);

        return Created($"/admins/{admin.Id}", response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAdmin(Guid id)
    {
        var result = await _adminService.Delete(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    private static AdminResponse ToAdminResponse(Admin admin)
    {
        return new AdminResponse(
            admin.Id,
            admin.FullName,
            admin.Email,
            admin.PhoneNumber,
            admin.Role,
            admin.UniversityId,
            admin.University?.ShortName,
            admin.University?.FullName,
            admin.University?.Branch,
            admin.CreatedAt
        );
    }
}
