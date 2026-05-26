namespace backend.Responses.LostItems;

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