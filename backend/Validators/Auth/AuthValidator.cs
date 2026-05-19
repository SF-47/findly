using backend.Requests.Auth;

namespace backend.Validators.Auth;

public static class AuthValidator
{
    public static List<string> ValidateLoginInputs(AdminLoginRequest request)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required");
        }
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors.Add("Password is required");
        }

        return errors;
    }

    public static List<string> ValidateChangePasswordInputs(ChangePasswordRequest request)
    {
        var errors = new List<String>();
        if (request.AdminId <= 0)
        {
            errors.Add("Admin ID is required");
        }
        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
        {
            errors.Add("Old password is required");
        }
        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            errors.Add("New password is required");
        }
        if (!string.IsNullOrWhiteSpace(request.NewPassword) && request.NewPassword.Length < 6)
        {
            errors.Add("New password must be at least 6 characters.");
        }
        if (
            !string.IsNullOrWhiteSpace(request.NewPassword)
            && !string.IsNullOrWhiteSpace(request.CurrentPassword)
            && request.NewPassword == request.CurrentPassword
        )
        {
            errors.Add("New password must be different from current password.");
        }
        return errors;
    }
}
