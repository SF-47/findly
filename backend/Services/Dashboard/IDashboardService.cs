using backend.Responses.Dashboard;

namespace backend.Services.Dashboard;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummary(bool isOwner, Guid? universityId);
}
