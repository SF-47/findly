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
}
