using backend.Requests.Students;

namespace backend.Validators.Students;

public static class StudentValidator
{
    public static List<string> ValidateCreate(CreateStudentRequest request)
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

        if (request.UniversityId == Guid.Empty)
        {
            errors.Add("University is required.");
        }

        if (string.IsNullOrWhiteSpace(request.UniversityStudentId))
        {
            errors.Add("University student ID is required.");
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
            errors.Add("Full name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }

        if (request.UniversityId == Guid.Empty)
        {
            errors.Add("University is required.");
        }

        if (string.IsNullOrWhiteSpace(request.UniversityStudentId))
        {
            errors.Add("University student ID is required.");
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