namespace backend.Requests.LostItems;

public record CreateLostItemRequest(
    int StudentId,
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime LostDate,
    string ImageUrl
);
