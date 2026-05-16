namespace backend.Responses.LostItems;

public record FullLostItemsResponse(
    int Id,
    int StudentId,
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