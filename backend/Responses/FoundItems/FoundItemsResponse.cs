namespace backend.Responses.FoundItems;

public record FullFoundItemsResponse(
    int Id,
    int StudentId,
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl,
    string Status,
    DateTime CreatedAt
);