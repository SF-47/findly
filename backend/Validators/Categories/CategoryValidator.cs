using backend.Requests.Categories;

namespace backend.Validators.Categories;

public static class CategoryValidator
{
    public static List<string> ValidateCreate(CreateCategoryRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            errors.Add("Category name is required");
        }

        return errors;
    }

    public static List<string> ValidateUpdate(UpdateCategoryRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            errors.Add("Category name is required");
        }
        return errors;
    }
}
