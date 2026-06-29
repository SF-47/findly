namespace backend.Requests.FoundItems;

// MOBILE APP ONLY
public record CreateFoundItemByStudentRequest(
    int CategoryId,
    string ItemName,
    string Description,
    string Color,
    string Location,
    DateTime FoundDate,
    string ImageUrl
);