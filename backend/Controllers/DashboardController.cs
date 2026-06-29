using backend.Services.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// ! ADMIN PANEL ONLY
[ApiController]
[Route("dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetAllStats()
    {
        var owner = IsAdminOwner();
        var uniAdmin = IsAdminUniversityAdmin();

        if (owner)
        {
            var summary = await _dashboardService.GetSummary(true, null);

            return Ok(summary);
        }

        if (uniAdmin)
        {
            var adminUniversityId = GetAdminUniversityId();

            if (adminUniversityId is null)
            {
                return Forbid();
            }

            var summary = await _dashboardService.GetSummary(false, adminUniversityId.Value);

            return Ok(summary);
        }

        return Forbid();
    }

    private bool IsAdminOwner()
    {
        return User.IsInRole("Owner");
    }

    private bool IsAdminUniversityAdmin()
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
}
