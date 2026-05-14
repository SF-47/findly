using backend.Requests.Students;

namespace backend.Validators.Students;

public static class StudentValidator
{
    public static List<string> ValidateCreate(CreateStudentRequest request)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors.Add("FullName is required.");
        }
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }
        if (string.IsNullOrWhiteSpace(request.UniversityId))
        {
            errors.Add("University ID is required.");
        }
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            errors.Add("Phone number is required.");
        }
        if (string.IsNullOrWhiteSpace(request.UniversityCardImageUrl))
        {
            errors.Add("University identity card is required.");
        }

        return errors;
    }

    public static List<string> ValidateUpdate(UpdateStudentRequest request)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors.Add("FullName is required.");
        }
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }
        if (string.IsNullOrWhiteSpace(request.UniversityId))
        {
            errors.Add("University ID is required.");
        }
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            errors.Add("Phone number is required.");
        }
        if (string.IsNullOrWhiteSpace(request.UniversityCardImageUrl))
        {
            errors.Add("University identity card is required.");
        }

        return errors;
    }
}
