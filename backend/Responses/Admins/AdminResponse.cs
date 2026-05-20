namespace backend.Responses.Admins;

public record AdminResponse(
    Guid Id,
    string FullName,
    string Email,
    string PhoneNumber,
    DateTime CreatedAt
);