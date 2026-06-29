namespace backend.Responses.Dashboard;

// ! ADMIN PANEL ONLY
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
