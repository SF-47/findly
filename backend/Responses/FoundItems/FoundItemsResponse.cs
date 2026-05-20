namespace backend.Responses.FoundItems;

public record FullFoundItemsResponse(
    Guid Id,
    Guid StudentId,
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