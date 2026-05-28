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
        var cleanName = name.Trim().ToLower();
        var exists = await _db.Categories.AnyAsync(c => c.Name.ToLower() == cleanName);

        return exists;
    }

    public async Task<Category?> GetById(int id)
    {
        return await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category> Create(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim() ?? "",
        };

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

        category.Name = request.Name.Trim();
        category.Description = request.Description?.Trim() ?? "";
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task<bool> CategoryNameExistsExceptId(int id , string name)
    {
        var cleanName = name.Trim().ToLower();
        var exists = await _db.Categories.AnyAsync(c =>
            c.Name.ToLower() == cleanName && c.Id != id
        );

        return exists;
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
