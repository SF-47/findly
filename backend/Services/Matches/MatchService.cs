using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Matches;

public class MatchService : IMatchService
{
    private readonly AppDbContext _db;

    public MatchService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ItemsMatch>> GetMatchesForStudent(Guid studentId)
    {
        return await _db.Matches
            .AsNoTracking()
            .Include(m => m.LostItem)
                .ThenInclude(l => l.Category)
            .Include(m => m.LostItem)
                .ThenInclude(l => l.Student)
                    .ThenInclude(s => s.University)
            .Include(m => m.FoundItem)
                .ThenInclude(f => f.Category)
            .Include(m => m.FoundItem)
                .ThenInclude(f => f.Student)
                    .ThenInclude(s => s.University)
            .Where(m => (m.LostItem.StudentId == studentId || m.FoundItem.StudentId == studentId) && m.Status == "Confirmed")
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}