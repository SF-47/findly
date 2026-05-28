using System.Security.Claims;
using backend.Requests.Auth;
using backend.Responses.Auth;
using backend.Responses.Errors;
using backend.Services.Auth;
using backend.Services.Jwt;
using backend.Validators.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtService _jwtService;

    public AuthController(IAuthService authService, IJwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin(AdminLoginRequest request)
    {
        var errors = AuthValidator.ValidateLoginInputs(request);

        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var admin = await _authService.Login(request);

        if (admin is null)
        {
            errors.Add("Invalid email or password.");
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }
        var token = _jwtService.GenerateToken(admin);

        var response = new AdminLoginResponse(
            admin.Id,
            admin.FullName,
            admin.Email,
            admin.Role,
            admin.UniversityId,
            admin.University?.ShortName,
            admin.University?.FullName,
            admin.University?.Branch,
            token
        );

        return Ok(response);
    }

    [Authorize]
    [HttpPut("admin/change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var adminIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(adminIdValue, out var adminId))
        {
            return Unauthorized();
        }
        var errors = AuthValidator.ValidateChangePasswordInputs(request);

        if (errors.Count > 0)
        {
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var changed = await _authService.ChangePassword(adminId , request);

        if (!changed)
        {
            errors.Add("Current password is incorrect.");
            var errorResponse = new ErrorResponse("Validation failed", errors);
            return BadRequest(errorResponse);
        }

        var message = "Password changed successfully.";
        return Ok(message);
    }
}
