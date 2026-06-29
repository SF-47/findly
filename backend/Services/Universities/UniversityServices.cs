using backend.Data;
using backend.Models;
using backend.Requests.Universities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Universities;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public class UniversityService : IUniversityService
{
    private readonly AppDbContext _db;

    public UniversityService(AppDbContext db)
    {
        _db = db;
    }

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    public async Task<List<University>> GetAll()
    {
        return await _db.Universities.OrderBy(u => u.ShortName).ThenBy(u => u.Branch).ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<University?> GetById(Guid id)
    {
        return await _db.Universities.FirstOrDefaultAsync(u => u.Id == id);
    }

    // ! ADMIN PANEL ONLY
    public async Task<University> Create(CreateUniversityRequest request)
    {
        var university = new University
        {
            ShortName = request.ShortName.Trim().ToUpper(),
            FullName = request.FullName.Trim(),
            Branch = request.Branch.Trim(),
            CreatedAt = DateTime.UtcNow,
        };

        _db.Universities.Add(university);

        await _db.SaveChangesAsync();

        return university;
    }

    // ! ADMIN PANEL ONLY
    public async Task<University?> Update(Guid id, UpdateUniversityRequest request)
    {
        var university = await GetById(id);

        if (university is null)
        {
            return null;
        }

        university.ShortName = request.ShortName.Trim().ToUpper();
        university.FullName = request.FullName.Trim();
        university.Branch = request.Branch.Trim();

        await _db.SaveChangesAsync();

        return university;
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> Delete(Guid id)
    {
        var university = await GetById(id);

        if (university is null)
        {
            return false;
        }

        _db.Universities.Remove(university);

        await _db.SaveChangesAsync();

        return true;
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> ExistsByShortNameFullNameAndBranch(
        string shortName,
        string fullName,
        string branch
    )
    {
        var cleanShortName = shortName.Trim().ToLower();
        var cleanFullName = fullName.Trim().ToLower();
        var cleanBranch = branch.Trim().ToLower();

        return await _db.Universities.AnyAsync(u =>
            u.ShortName.ToLower() == cleanShortName
            && u.FullName.ToLower() == cleanFullName
            && u.Branch.ToLower() == cleanBranch
        );
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> ExistsByShortNameFullNameAndBranchExceptId(
        Guid id,
        string shortName,
        string fullName,
        string branch
    )
    {
        var cleanShortName = shortName.Trim().ToLower();
        var cleanFullName = fullName.Trim().ToLower();
        var cleanBranch = branch.Trim().ToLower();

        return await _db.Universities.AnyAsync(u =>
            u.Id != id
            && u.ShortName.ToLower() == cleanShortName
            && u.FullName.ToLower() == cleanFullName
            && u.Branch.ToLower() == cleanBranch
        );
    }
}
