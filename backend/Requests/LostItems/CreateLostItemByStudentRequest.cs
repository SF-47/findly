namespace backend.Requests.LostItems;

// MOBILE APP ONLY
public record CreateLostItemByStudentRequest(
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime LostDate,
    string ImageUrl
);
