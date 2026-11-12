namespace backend.Requests.Auth;

// ! ADMIN PANEL ONLY
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
