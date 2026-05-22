using backend.Requests.Universities;

namespace backend.Validators.Universities;

public static class UniversityValidator
{
    public static List<string> ValidateCreate(CreateUniversityRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.ShortName))
        {
            errors.Add("University short name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors.Add("University full name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Branch))
        {
            errors.Add("Branch is required.");
        }

        return errors;
    }

    public static List<string> ValidateUpdate(UpdateUniversityRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.ShortName))
        {
            errors.Add("University short name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors.Add("University full name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Branch))
        {
            errors.Add("Branch is required.");
        }

        return errors;
    }
}