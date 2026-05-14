using backend.Data;
using backend.Models;
using backend.Requests.Categories;
using backend.Responses.Errors;
using backend.Validators.Categories;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Categories;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Category>> GetAll()
    {
        return await _db.Categories.ToListAsync();
    }

    public async Task<bool> CategoryNameExists(string name)
    {
        var exists = await _db.Categories.AnyAsync(c => c.Name.ToLower() == name.ToLower());

        return exists;
    }

    public async Task<Category?> GetById(int id)
    {
        return await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category> Create(CreateCategoryRequest request)
    {
        var category = new Category { Name = request.Name };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return category;
    }

    public async Task<Category?> Update(int id, UpdateCategoryRequest request)
    {
        var category = await GetById(id);
        if (category is null)
        {
            return null;
        }

        category.Name = request.Name;
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task<bool> Delete(int id)
    {
        var category = await GetById(id);
        if (category is null)
        {
            return false;
        }
        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return true;
    }
}
