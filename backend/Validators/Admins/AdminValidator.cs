using backend.Requests.Admins;

namespace backend.Validators.Admins;

public static class AdminValidator
{
    public static List<string> ValidateCreate(CreateAdminRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors.Add("Full name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors.Add("Password is required.");
        }

        if (!string.IsNullOrWhiteSpace(request.Password) && request.Password.Length < 6)
        {
            errors.Add("Password must be at least 6 characters.");
        }

        return errors;
    }
}