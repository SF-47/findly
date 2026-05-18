namespace backend.Responses.Auth;

public record AdminLoginResponse(
    int Id,
    string FullName,
    string Email
);

