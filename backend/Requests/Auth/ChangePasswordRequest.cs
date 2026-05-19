namespace backend.Requests.Auth;

public record ChangePasswordRequest(int AdminId, string CurrentPassword, string NewPassword);
