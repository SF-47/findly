namespace backend.Requests.FoundItems;

public record UpdateFoundItemRequest(
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl
);
