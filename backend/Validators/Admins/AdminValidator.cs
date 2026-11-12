using backend.Requests.Admins;

namespace backend.Validators.Admins;

public static class AdminValidator
{
    private static readonly string[] AllowedRoles = ["Owner", "UniversityAdmin"];

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

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            errors.Add("Phone number is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors.Add("Password is required.");
        }

        if (!string.IsNullOrWhiteSpace(request.Password) && request.Password.Length < 6)
        {
            errors.Add("Password must be at least 6 characters.");
        }

        if (string.IsNullOrWhiteSpace(request.Role))
        {
            errors.Add("Role is required.");
        }
        else if (!AllowedRoles.Contains(request.Role.Trim()))
        {
            errors.Add("Role must be Owner or UniversityAdmin.");
        }

        if (request.Role == "UniversityAdmin" && request.UniversityId is null)
        {
            errors.Add("University is required for university admin.");
        }

        if (request.Role == "Owner" && request.UniversityId is not null)
        {
            errors.Add("Owner should not be assigned to a specific university.");
        }

        return errors;
    }
}