using backend.Data;
using backend.Models;
using backend.Requests.FoundItems;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.FoundItems;

public class FoundItemsServices : IFoundItemService
{
    public readonly AppDbContext _db;

    public FoundItemsServices(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<FoundItem>> GetAll()
    {
        return await _db.FoundItems.ToListAsync();
    }

    public async Task<FoundItem?> GetById(Guid id)
    {
        return await _db.FoundItems.FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<FoundItem> Create(CreateFoundItemRequest request)
    {
        var FoundItem = new FoundItem
        {
            StudentId = request.StudentId,
            CategoryId = request.CategoryId,
            ItemName = request.ItemName,
            Description = request.Description,
            Color = request.Color,
            Location = request.Location,
            FoundDate = DateTime.SpecifyKind(request.FoundDate, DateTimeKind.Utc),
            ImageUrl = request.ImageUrl,
            Status = "open",
            CreatedAt = DateTime.UtcNow,
        };

        _db.FoundItems.Add(FoundItem);
        await _db.SaveChangesAsync();

        return FoundItem;
    }

    public async Task<FoundItem?> Update(Guid id, UpdateFoundItemRequest request)
    {
        var FoundItem = await GetById(id);
        if (FoundItem is null)
        {
            return null;
        }
        FoundItem.CategoryId = request.CategoryId;
        FoundItem.ItemName = request.ItemName;
        FoundItem.Description = request.Description;
        FoundItem.Color = request.Color;
        FoundItem.Location = request.Location;
        FoundItem.FoundDate = DateTime.SpecifyKind(request.FoundDate, DateTimeKind.Utc);
        FoundItem.ImageUrl = request.ImageUrl;
        FoundItem.Status = "open";
        FoundItem.CreatedAt = DateTime.UtcNow;

        return FoundItem;
    }

    public async Task<bool> Delete(Guid id)
    {
        var FoundItem = await GetById(id);
        if (FoundItem is null)
        {
            return false;
        }
        _db.Remove(FoundItem);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> StudentExists(Guid studentId)
    {
        return await _db.Students.AnyAsync(s => s.Id == studentId);
    }

    public async Task<bool> CategoryExists(int categoryId)
    {
        return await _db.Categories.AnyAsync(c => c.Id == categoryId);
    }
}
