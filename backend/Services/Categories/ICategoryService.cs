using backend.Models;
using backend.Requests.Categories;

namespace backend.Services.Categories;

public interface ICategoryService
{
    Task<List<Category>> GetAll();
    Task<Category?> GetById(int id);
    Task<Category> Create(CreateCategoryRequest request);
    Task<bool> CategoryNameExists(string name);
    Task<Category?> Update(int id, UpdateCategoryRequest request);
    Task<bool> Delete(int id);
}
