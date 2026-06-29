using backend.Responses.Dashboard;

namespace backend.Services.Dashboard;

// ! ADMIN PANEL ONLY
public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummary(bool isOwner, Guid? universityId);
}
