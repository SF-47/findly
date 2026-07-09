using backend.Data;
using backend.Models;
using backend.Requests.Students;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Students;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public class StudentServices : IStudentServices
{
    private readonly AppDbContext _db;

    public StudentServices(AppDbContext db)
    {
        _db = db;
    }

    // ! ADMIN PANEL ONLY
    public async Task<List<Student>> GetAll()
    {
        return await _db.Students.Include(s => s.University).ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<Student?> GetById(Guid id)
    {
        return await _db.Students.Include(s => s.University).FirstOrDefaultAsync(s => s.Id == id);
    }

    // MOBILE APP ONLY
    public async Task<Student?> GetCurrentStudent(Guid studentId)
    {
        return await _db
            .Students.Include(s => s.University)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == studentId);
    }

    // ! ADMIN PANEL ONLY
    public async Task<List<Student>> GetByUniversityId(Guid uniId)
    {
        return await _db
            .Students.Include(s => s.University)
            .Where(s => s.UniversityId == uniId)
            .ToListAsync();
    }

    // ! ADMIN PANEL ONLY
    public async Task<Student> Create(CreateStudentRequest request)
    {
        var student = new Student
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            UniversityId = request.UniversityId,
            UniversityStudentId = request.UniversityStudentId.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            UniversityCardImageUrl = request.UniversityCardImageUrl.Trim(),
        };

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        return student;
    }

    // ! ADMIN PANEL ONLY
    public async Task<Student?> Update(Guid id, UpdateStudentRequest request)
    {
        var student = await GetById(id);

        if (student is null)
        {
            return null;
        }

        student.FullName = request.FullName.Trim();
        student.Email = request.Email.Trim().ToLower();
        student.UniversityId = request.UniversityId;
        student.UniversityStudentId = request.UniversityStudentId.Trim();
        student.PhoneNumber = request.PhoneNumber.Trim();
        student.UniversityCardImageUrl = request.UniversityCardImageUrl.Trim();

        await _db.SaveChangesAsync();

        return student;
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> Delete(Guid id)
    {
        var student = await GetById(id);

        if (student is null)
        {
            return false;
        }

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();

        return true;
    }

    // ! ADMIN PANEL ONLY
    public async Task<Student?> VerifyStudent(Guid id)
    {
        var student = await GetById(id);

        if (student is null)
        {
            return null;
        }

        student.IsVerified = true;

        await _db.SaveChangesAsync();

        return student;
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> EmailExists(string email)
    {
        return await _db.Students.AnyAsync(s => s.Email.ToLower() == email.Trim().ToLower());
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> PhoneNbExists(string phoneNb)
    {
        return await _db.Students.AnyAsync(s => s.PhoneNumber == phoneNb.Trim());
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> UniversityExists(Guid universityId)
    {
        return await _db.Universities.AnyAsync(u => u.Id == universityId);
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> UniversityStudentIdExists(Guid universityId, string universityStudentId)
    {
        return await _db.Students.AnyAsync(s =>
            s.UniversityId == universityId && s.UniversityStudentId == universityStudentId.Trim()
        );
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> EmailExistsForAnotherStudent(string email, Guid id)
    {
        return await _db.Students.AnyAsync(s =>
            s.Id != id && s.Email.ToLower() == email.Trim().ToLower()
        );
    }

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    public async Task<bool> PhoneNbExistsForAnotherStudent(string phoneNb, Guid id)
    {
        return await _db.Students.AnyAsync(s => s.Id != id && s.PhoneNumber == phoneNb.Trim());
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> UniversityStudentIdExistsForAnotherStudent(
        Guid universityId,
        string universityStudentId,
        Guid id
    )
    {
        return await _db.Students.AnyAsync(s =>
            s.Id != id
            && s.UniversityId == universityId
            && s.UniversityStudentId == universityStudentId.Trim()
        );
    }

    // MOBILE APP ONLY
    public async Task<Student?> UpdateStudentOwnInfo(Guid studentId, UpdateStudentOwnInfo request)
    {
        var student = await _db
            .Students.Include(s => s.University)
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student is null)
        {
            return null;
        }

        student.FullName = request.FullName.Trim();
        student.PhoneNumber = request.PhoneNumber.Trim();

        await _db.SaveChangesAsync();

        return student;
    }

    public async Task<Student?> UpdatePushToken(Guid studentId, UpdatePushTokenRequest request)
    {
        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == studentId);
        if (student is null)
            return null;

        student.ExpoPushToken = request.PushToken?.Trim();
        await _db.SaveChangesAsync();

        return student;
    }
}
