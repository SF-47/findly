namespace backend.Requests.FoundItems;

// ! ADMIN PANEL ONLY
public record CreateFoundItemRequest(
    Guid StudentId,
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl
);
