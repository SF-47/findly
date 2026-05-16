using backend.Data;
using backend.Models;
using backend.Requests.LostItems;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.LostItems;

public class LostItemsServices : ILostItemsService
{
    public readonly AppDbContext _db;

    public LostItemsServices(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<LostItem>> GetAll()
    {
        return await _db.LostItems.ToListAsync();
    }

    public async Task<LostItem?> GetById(int id)
    {
        return await _db.LostItems.FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<LostItem> Create(CreateLostItemRequest request)
    {
        var lostItem = new LostItem
        {
            StudentId = request.StudentId,
            CategoryId = request.CategoryId,
            ItemName = request.ItemName,
            Description = request.Description,
            Color = request.Color,
            Location = request.Location,
            LostDate = DateTime.SpecifyKind(request.LostDate, DateTimeKind.Utc),
            ImageUrl = request.ImageUrl,
            Status = "open",
            CreatedAt = DateTime.UtcNow,
        };

        _db.LostItems.Add(lostItem);
        await _db.SaveChangesAsync();

        return lostItem;
    }

    public async Task<LostItem?> Update(int id, UpdateLostItemRequest request)
    {
        var lostItem = await GetById(id);
        if (lostItem is null)
        {
            return null;
        }
        lostItem.CategoryId = request.CategoryId;
        lostItem.ItemName = request.ItemName;
        lostItem.Description = request.Description;
        lostItem.Color = request.Color;
        lostItem.Location = request.Location;
        lostItem.LostDate = DateTime.SpecifyKind(request.LostDate, DateTimeKind.Utc);
        lostItem.ImageUrl = request.ImageUrl;
        lostItem.Status = "open";
        lostItem.CreatedAt = DateTime.UtcNow;

        return lostItem;
    }

    public async Task<bool> Delete(int id)
    {
        var lostItem = await GetById(id);
        if (lostItem is null)
        {
            return false;
        }
        _db.Remove(lostItem);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> StudentExists(int studentId)
    {
        return await _db.Students.AnyAsync(s => s.Id == studentId);
    }

    public async Task<bool> CategoryExists(int categoryId)
    {
        return await _db.Categories.AnyAsync(c => c.Id == categoryId);
    }
}
