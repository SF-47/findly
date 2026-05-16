namespace backend.Requests.FoundItems;

public record CreateFoundItemRequest(
    int StudentId,
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl
);
