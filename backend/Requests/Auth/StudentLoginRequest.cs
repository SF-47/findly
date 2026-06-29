namespace  backend.Requests.Auth;

// MOBILE APP ONLY
public record StudentLoginRequest(
    string Email,
    string Password
);