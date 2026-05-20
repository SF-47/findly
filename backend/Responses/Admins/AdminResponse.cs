namespace backend.Responses.Admins;

public record AdminResponse(
    int Id,
    string FullName,
    string Email,
    string PhoneNumber,
    DateTime CreatedAt
);