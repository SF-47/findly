using backend.Models;
using backend.Requests.Categories;

namespace backend.Services.Categories;

public interface ICategoryService
{
    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    Task<List<Category>> GetAll();

    // ! ADMIN PANEL ONLY
    Task<Category?> GetById(int id);

    // ! ADMIN PANEL ONLY
    Task<Category> Create(CreateCategoryRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> CategoryNameExists(string name);

    // ! ADMIN PANEL ONLY
    Task<Category?> Update(int id, UpdateCategoryRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> CategoryNameExistsExceptId(int id, string name);

    // ! ADMIN PANEL ONLY
    Task<bool> Delete(int id);
}
