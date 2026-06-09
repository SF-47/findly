using backend.Requests.Auth;

namespace backend.Validators;

public static class StudentAuthValidator
{
    public static Dictionary<string, string> ValidateRegister(StudentRegisterRequest request)
    {
        var errors = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors["fullName"] = "Full name is required.";
        }
        else if (request.FullName.Trim().Length < 3)
        {
            errors["fullName"] = "Full name must be at least 3 characters.";
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors["email"] = "Email is required.";
        }
        else if (!request.Email.Contains("@") || !request.Email.Contains("."))
        {
            errors["email"] = "Email format is invalid.";
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors["password"] = "Password is required.";
        }
        else if (request.Password.Length < 6)
        {
            errors["password"] = "Password must be at least 6 characters.";
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            errors["phoneNumber"] = "Phone number is required.";
        }
        else if (!IsValidLebanesePhone(request.PhoneNumber.Trim()))
        {
            errors["phoneNumber"] = "Phone number must be a valid Lebanese mobile number.";
        }

        if (request.UniversityId == Guid.Empty)
        {
            errors["universityId"] = "University is required.";
        }

        if (string.IsNullOrWhiteSpace(request.UniversityStudentId))
        {
            errors["universityStudentId"] = "University student ID is required.";
        }

        if (string.IsNullOrWhiteSpace(request.UniversityCardImageUrl))
        {
            errors["universityCardImageUrl"] = "University card image is required.";
        }
        else if (!request.UniversityCardImageUrl.StartsWith("http"))
        {
            errors["universityCardImageUrl"] = "University card image must be a valid URL.";
        }

        return errors;
    }

    public static Dictionary<string, string> ValidateLogin(StudentLoginRequest request)
    {
        var errors = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors["email"] = "Email is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors["password"] = "Password is required.";
        }

        return errors;
    }

    private static bool IsValidLebanesePhone(string phoneNumber)
    {
        if (phoneNumber.Length != 8)
        {
            return false;
        }

        var validPrefixes = new[] { "03", "70", "71", "76", "78", "79", "81" };

        return validPrefixes.Any(prefix => phoneNumber.StartsWith(prefix))
               && phoneNumber.All(char.IsDigit);
    }
}