namespace  backend.Requests.Auth;

public record StudentLoginRequest(
    string Email,
    string Password
);