namespace backend.Responses.Auth;

public record AdminLoginResponse(
    Guid Id,
    string FullName,
    string Email
);

