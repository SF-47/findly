using backend.Requests.LostItems;

namespace backend.Validators.LostItems;

public static class LostItemsValidator
{
    public static List<string> ValidateCreate(CreateLostItemRequest request)
    {
        var errors = new List<string>();
        if (request.StudentId <= 0)
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
        if (request.LostDate == default)
        {
            errors.Add("Lost date ID is required");
        }
        if (request.LostDate > DateTime.UtcNow)
        {
            errors.Add("Lost date cannot be in the future.");
        }
        if (string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            errors.Add("Image is required.");
        }
        return errors;
    }

    public static List<string> ValidateUpdate(UpdateLostItemRequest request)
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

        if (request.LostDate == default)
        {
            errors.Add("Lost date is required.");
        }

        if (request.LostDate > DateTime.UtcNow)
        {
            errors.Add("Lost date cannot be in the future.");
        }

        if (string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            errors.Add("Image is required.");
        }

        return errors;
    }
}
