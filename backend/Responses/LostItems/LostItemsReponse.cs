namespace backend.Responses.LostItems;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record FullLostItemsResponse(
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
    DateTime LostDate,
    string ImageUrl,
    string Status,
    DateTime CreatedAt
);