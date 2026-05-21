using backend.Data;
using backend.Models;
using backend.Requests.Universities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Universities;

public class UniversityService : IUniversityService
{
    private readonly AppDbContext _db;

    public UniversityService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<University>> GetAll()
    {
        return await _db.Universities.ToListAsync();
    }

    public async Task<University?> GetById(Guid id)
    {
        return await _db.Universities.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<University> Create(CreateUniversityRequest request)
    {
        var university = new University { Name = request.Name, Branch = request.Branch };
        _db.Universities.Add(university);
        await _db.SaveChangesAsync();

        return university;

    }   
    public async Task<University?> Update(Guid id , UpdateUniversityRequest request)
    {
        var university = await GetById(id);
        if (university is null)
        {
            return null;
        }
        university.Name = request.Name;
        university.Branch = request.Branch;

        await _db.SaveChangesAsync();

        return university;
    }
}
