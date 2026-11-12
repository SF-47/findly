using backend.Data;
using backend.Models;
using backend.Requests.FoundItems;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.FoundItems;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public class FoundItemsServices : IFoundItemService
{
    public readonly AppDbContext _db;

    public FoundItemsServices(AppDbContext db)
    {
        _db = db;
    }

    // ! ADMIN PANEL ONLY
    public async Task<List<FoundItem>> GetAll()
    {
        return await _db
            .FoundItems.Include(f => f.Student)
                .ThenInclude(s => s.University)
            .Include(f => f.Category)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<List<FoundItem>> GetAllByUniversityId(Guid universityId)
    {
        return await _db
            .FoundItems.Include(f => f.Student)
                .ThenInclude(s => s.University)
            .Where(f => f.Student.UniversityId == universityId)
            .Include(f => f.Category)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<FoundItem?> GetById(Guid id)
    {
        return await _db
            .FoundItems.Include(f => f.Student)
                .ThenInclude(s => s.University)
            .Include(f => f.Category)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    // MOBILE APP ONLY
    public async Task<List<FoundItem>> GetAllFoundItemsCreatedByStudent(Guid studentId)
    {
        return await _db
            .FoundItems.Include(l => l.Student)
                .ThenInclude(s => s.University)
            .Where(s => s.StudentId == studentId)
            .Include(l => l.Category)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
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

        return await GetById(FoundItem.Id) ?? FoundItem;
    }

    // MOBILE APP ONLY
    public async Task<FoundItem> CreateFoundItemByStudent(
        Guid studentId,
        CreateFoundItemByStudentRequest request
    )
    {
        var foundItem = new FoundItem
        {
            StudentId = studentId,
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

        _db.FoundItems.Add(foundItem);
        await _db.SaveChangesAsync();

        return await GetById(foundItem.Id) ?? foundItem;
    }

    // MOBILE APP ONLY
    public async Task<FoundItem?> UpdateFoundItemByStudent(Guid studentId, Guid id, UpdateFoundItemRequest request)
    {
        var foundItem = await GetById(id);

        if (foundItem is null || foundItem.StudentId != studentId)
        {
            return null;
        }

        foundItem.CategoryId = request.CategoryId;
        foundItem.ItemName = request.ItemName.Trim();
        foundItem.Description = request.Description.Trim();
        foundItem.Color = request.Color.Trim();
        foundItem.Location = request.Location.Trim();
        foundItem.FoundDate = DateTime.SpecifyKind(request.FoundDate, DateTimeKind.Utc);
        foundItem.ImageUrl = request.ImageUrl.Trim();

        await _db.SaveChangesAsync();

        return foundItem;
    }

    // MOBILE APP ONLY
    public async Task<bool> DeleteFoundItemByStudent(Guid studentId, Guid id)
    {
        var foundItem = await GetById(id);
        if (foundItem is null || foundItem.StudentId != studentId)
        {
            return false;
        }
        
        _db.Remove(foundItem);
        await _db.SaveChangesAsync();

        return true;
    }

    // ! ADMIN PANEL ONLY
    public async Task<FoundItem?> Update(Guid id, UpdateFoundItemRequest request)
    {
        var foundItem = await GetById(id);

        if (foundItem is null)
        {
            return null;
        }

        foundItem.CategoryId = request.CategoryId;
        foundItem.ItemName = request.ItemName.Trim();
        foundItem.Description = request.Description.Trim();
        foundItem.Color = request.Color.Trim();
        foundItem.Location = request.Location.Trim();
        foundItem.FoundDate = DateTime.SpecifyKind(request.FoundDate, DateTimeKind.Utc);
        foundItem.ImageUrl = request.ImageUrl.Trim();

        await _db.SaveChangesAsync();

        return foundItem;
    }

    // ! ADMIN PANEL ONLY
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
