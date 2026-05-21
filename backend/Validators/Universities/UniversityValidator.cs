using backend.Requests.Universities;

namespace backend.Validators.Universities;

public static class UniversityValidator
{
    public static List<string> ValidateCreate(CreateUniversityRequest request)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            errors.Add("University name is required.");
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
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            errors.Add("University name is required.");
        }
        if (string.IsNullOrWhiteSpace(request.Branch))
        {
            errors.Add("Branch is required.");
        }

        return errors;
    }
}
