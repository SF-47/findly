namespace backend.Responses.Dashboard;

public record DashboardSummaryResponse(
    int TotalStudents,
    int VerifiedStudents,
    int PendingStudents,
    int TotalCategories,
    int LostItems,
    int FoundItems,
    int PossibleMatches,
    int TotalUniversities
);
