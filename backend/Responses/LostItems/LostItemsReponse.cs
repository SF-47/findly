namespace backend.Responses.LostItems;

public record FullLostItemsResponse(
    Guid Id,
    Guid StudentId,
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime LostDate,
    string ImageUrl,
    string Status,
    DateTime CreatedAt
);