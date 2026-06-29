namespace backend.Responses.ItemMatches;

// ! ADMIN PANEL ONLY
public record MatchItemResponse(
    Guid Id,
    string StudentName,
    string UniversityShortName,
    string UniversityFullName,
    string UniversityBranch,
    string CategoryName,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime Date,
    string ImageUrl
);

// ! ADMIN PANEL ONLY
public record ItemsMatchResponse(
    Guid Id,
    MatchItemResponse LostItem,
    MatchItemResponse FoundItem,
    int MatchPercentage,
    string ConfidenceLevel,
    string ReasoningSummary,
    string Status,
    DateTime CreatedAt,
    DateTime? ReviewedAt
);
