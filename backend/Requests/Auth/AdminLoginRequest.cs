namespace backend.Requests.Auth;

// ! ADMIN PANEL ONLY
public record AdminLoginRequest(string Email, string Password);
