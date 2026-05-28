namespace backend.Requests.Auth;

public record ChangePasswordRequest( string CurrentPassword, string NewPassword);
