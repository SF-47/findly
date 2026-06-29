namespace backend.Requests.FoundItems;

// ! ADMIN PANEL ONLY
public record UpdateFoundItemRequest(
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl
);
