namespace backend.Requests.Auth;

public record ChangePasswordRequest(Guid AdminId, string CurrentPassword, string NewPassword);
