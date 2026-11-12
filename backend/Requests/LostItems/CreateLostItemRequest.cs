namespace backend.Requests.LostItems;

// ! ADMIN PANEL ONLY
public record CreateLostItemRequest(
    Guid StudentId,
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime LostDate,
    string ImageUrl
);
