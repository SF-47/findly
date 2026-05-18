namespace backend.Responses.Admins;

public record AdminResponse(
    int Id,
    string FullName,
    string Email,
    DateTime CreatedAt
);