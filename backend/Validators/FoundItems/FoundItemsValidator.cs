using backend.Requests.FoundItems;

namespace backend.Validators.FoundItems;

public static class FoundItemsValidator
{
    public static List<string> ValidateCreate(CreateFoundItemRequest request)
    {
        var errors = new List<string>();
        if (request.StudentId == Guid.Empty)
        {
            errors.Add("Student ID is required");
        }
        if (request.CategoryId <= 0)
        {
            errors.Add("Category ID is required");
        }
        if (string.IsNullOrWhiteSpace(request.ItemName))
        {
            errors.Add("Item Name is required");
        }
        if (string.IsNullOrWhiteSpace(request.Description))
        {
            errors.Add("Description is required");
        }
        if (string.IsNullOrWhiteSpace(request.Color))
        {
            errors.Add("Color is required");
        }
        if (string.IsNullOrWhiteSpace(request.Location))
        {
            errors.Add("Location is required");
        }
        if (request.FoundDate == default)
        {
            errors.Add("Found date ID is required");
        }
        if (request.FoundDate > DateTime.UtcNow)
        {
            errors.Add("Found date cannot be in the future.");
        }
        if (string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            errors.Add("Image is required.");
        }
        return errors;
    }

    public static List<string> ValidateCreateByStudent(CreateFoundItemByStudentRequest request)
    {
        var errors = new List<string>();

        if (request.CategoryId <= 0)
        {
            errors.Add("Category ID is required");
        }
        if (string.IsNullOrWhiteSpace(request.ItemName))
        {
            errors.Add("Item Name is required");
        }
        if (string.IsNullOrWhiteSpace(request.Description))
        {
            errors.Add("Description is required");
        }
        if (string.IsNullOrWhiteSpace(request.Color))
        {
            errors.Add("Color is required");
        }
        if (string.IsNullOrWhiteSpace(request.Location))
        {
            errors.Add("Location is required");
        }
        if (request.FoundDate == default)
        {
            errors.Add("Found date ID is required");
        }
        if (request.FoundDate > DateTime.UtcNow)
        {
            errors.Add("Found date cannot be in the future.");
        }
        if (string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            errors.Add("Image is required.");
        }

        return errors;
    }

    public static List<string> ValidateUpdate(UpdateFoundItemRequest request)
    {
        var errors = new List<string>();

        if (request.CategoryId <= 0)
        {
            errors.Add("Category ID is required.");
        }

        if (string.IsNullOrWhiteSpace(request.ItemName))
        {
            errors.Add("Item name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            errors.Add("Description is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Color))
        {
            errors.Add("Color is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Location))
        {
            errors.Add("Location is required.");
        }

        if (request.FoundDate == default)
        {
            errors.Add("Found date is required.");
        }

        if (request.FoundDate > DateTime.UtcNow)
        {
            errors.Add("Found date cannot be in the future.");
        }

        if (string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            errors.Add("Image is required.");
        }

        return errors;
    }
}
