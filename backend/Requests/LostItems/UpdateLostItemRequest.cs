namespace backend.Requests.LostItems;

public record UpdateLostItemRequest(
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime LostDate,
    string ImageUrl
);