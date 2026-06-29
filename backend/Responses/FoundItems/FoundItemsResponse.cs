namespace backend.Responses.FoundItems;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record FullFoundItemsResponse(
    Guid Id,
    Guid StudentId,
    string StudentName,
    string UniversityShortName,
    string UniversityBranch,
    int CategoryId,
    string CategoryName,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl,
    string Status,
    DateTime CreatedAt
);