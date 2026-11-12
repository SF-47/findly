using backend.Data;
using backend.Models;
using backend.Requests.LostItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.LostItems;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public class LostItemsServices : ILostItemsService
{
    public readonly AppDbContext _db;

    public LostItemsServices(AppDbContext db)
    {
        _db = db;
    }

    // ! ADMIN PANEL ONLY
    public async Task<List<LostItem>> GetAll()
    {
        return await _db
            .LostItems.Include(l => l.Student)
                .ThenInclude(s => s.University)
            .Include(l => l.Category)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<List<LostItem>> GetAllByUniversityId(Guid universityId)
    {
        return await _db
            .LostItems.Include(l => l.Student)
                .ThenInclude(s => s.University)
            .Where(l => l.Student.UniversityId == universityId)
            .Include(l => l.Category)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<LostItem?> GetById(Guid id)
    {
        return await _db
            .LostItems.Include(l => l.Student)
                .ThenInclude(s => s.University)
            .Include(l => l.Category)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    // MOBILE APP ONLY
    public async Task<List<LostItem>> GetAllLostItemsCreatedByStudent(Guid studentId)
    {
        return await _db
            .LostItems.Include(l => l.Student)
                .ThenInclude(s => s.University)
            .Where(s => s.StudentId == studentId)
            .Include(l => l.Category)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
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

        return await GetById(lostItem.Id) ?? lostItem;
    }

    // MOBILE APP ONLY
    public async Task<LostItem> CreateLostItemByStudent(
        Guid studentId,
        CreateLostItemByStudentRequest request
    )
    {
        var lostItem = new LostItem
        {
            StudentId = studentId,
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

        return await GetById(lostItem.Id) ?? lostItem;
    }

    // MOBILE APP ONLY
    public async Task<LostItem?> UpdateLostItemByStudent(Guid studentId, Guid id, UpdateLostItemRequest request)
    {
        var lostItem = await GetById(id);

        if (lostItem is null || lostItem.StudentId != studentId)
        {
            return null;
        }

        lostItem.CategoryId = request.CategoryId;
        lostItem.ItemName = request.ItemName.Trim();
        lostItem.Description = request.Description.Trim();
        lostItem.Color = request.Color.Trim();
        lostItem.Location = request.Location.Trim();
        lostItem.LostDate = DateTime.SpecifyKind(request.LostDate, DateTimeKind.Utc);
        lostItem.ImageUrl = request.ImageUrl.Trim();

        await _db.SaveChangesAsync();

        return lostItem;
    }

    // MOBILE APP ONLY
    public async Task<bool> DeleteLostItemByStudent(Guid studentId, Guid id)
    {
        var lostItem = await GetById(id);
        if (lostItem is null || lostItem.StudentId != studentId)
        {
            return false;
        }
        
        _db.Remove(lostItem);
        await _db.SaveChangesAsync();

        return true;
    }

    // ! ADMIN PANEL ONLY
    public async Task<LostItem?> Update(Guid id, UpdateLostItemRequest request)
    {
        var lostItem = await GetById(id);

        if (lostItem is null)
        {
            return null;
        }

        lostItem.CategoryId = request.CategoryId;
        lostItem.ItemName = request.ItemName.Trim();
        lostItem.Description = request.Description.Trim();
        lostItem.Color = request.Color.Trim();
        lostItem.Location = request.Location.Trim();
        lostItem.LostDate = DateTime.SpecifyKind(request.LostDate, DateTimeKind.Utc);
        lostItem.ImageUrl = request.ImageUrl.Trim();

        await _db.SaveChangesAsync();

        return lostItem;
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> Delete(Guid id)
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

    // ! ADMIN PANEL ONLY
    public async Task<bool> StudentExists(Guid studentId)
    {
        return await _db.Students.AnyAsync(s => s.Id == studentId);
    }

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    public async Task<bool> CategoryExists(int categoryId)
    {
        return await _db.Categories.AnyAsync(c => c.Id == categoryId);
    }

    // ! ADMIN PANEL ONLY
    public async Task<Guid?> GetUniversityIdFromStudentId(Guid studentId)
    {
        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == studentId);
        if (student is null)
        {
            return null;
        }
        return student.UniversityId;
    }
}
