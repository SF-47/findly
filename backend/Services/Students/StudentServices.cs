using backend.Data;
using backend.Models;
using backend.Requests.Students;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Students;

public class StudentServices : IStudentServices
{
    private readonly AppDbContext _db;

    public StudentServices(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Student>> GetAll()
    {
        return await _db.Students.ToListAsync();
    }

    public async Task<Student?> GetById(int id)
    {
        return await _db.Students.FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Student> Create(CreateStudentRequest request)
    {
        var student = new Student
        {
            FullName = request.FullName,
            Email = request.Email,
            UniversityName = request.UniversityName,
            UniversityId = request.UniversityId,
            PhoneNumber = request.PhoneNumber,
            UniversityCardImageUrl = request.UniversityCardImageUrl,
        };

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        return student;
    }

    public async Task<Student?> Update(int id, UpdateStudentRequest request)
    {
        var student = await GetById(id);
        if (student is null)
        {
            return null;
        }

        student.FullName = request.FullName;
        student.Email = request.Email;
        student.UniversityName = request.UniversityName;
        student.UniversityId = request.UniversityId;
        student.PhoneNumber = request.PhoneNumber;
        student.UniversityCardImageUrl = request.UniversityCardImageUrl;

        await _db.SaveChangesAsync();
        return student;
    }

    public async Task<bool> Delete(int id)
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

    public async Task<bool> EmailExists(string email)
    {
        var exists = await _db.Students.AnyAsync(s => s.Email.ToLower() == email.Trim().ToLower());
        return exists;
    }

    public async Task<bool> UniIdExists(string uniId)
    {
        var exists = await _db.Students.AnyAsync(s =>
            s.UniversityId.ToLower() == uniId.Trim().ToLower()
        );
        return exists;
    }

    public async Task<bool> PhoneNbExists(string phoneNb)
    {
        var exists = await _db.Students.AnyAsync(s => s.PhoneNumber == phoneNb.Trim());
        return exists;
    }

    public async Task<bool> EmailExistsForAnotherStudent(string email, int id)
    {
        var exists = await _db.Students.AnyAsync(s =>
            s.Id != id && s.Email.ToLower() == email.Trim().ToLower()
        );
        return exists;
    }

    public async Task<bool> PhoneNbExistsForAnotherStudent(string phoneNb, int id)
    {
        var exists = await _db.Students.AnyAsync(s =>
            s.Id != id && s.PhoneNumber == phoneNb.Trim()
        );
        return exists;
    }

    public async Task<bool> UniversityStudentIdExists(string universityName, string universityId)
    {
        var exists = await _db.Students.AnyAsync(s =>
            s.UniversityName == universityName && s.UniversityId == universityId
        );
        return exists;
    }

    public async Task<bool> UniversityStudentIdExistsForAnotherStudent(
        string universityName,
        string universityId,
        int id
    )
    {
        var normalizedUniversityName = universityName.Trim().ToLower();
        var normalizedUniversityId = universityId.Trim().ToLower();

        return await _db.Students.AnyAsync(s =>
            s.Id != id
            && s.UniversityName.ToLower() == normalizedUniversityName
            && s.UniversityId.ToLower() == normalizedUniversityId
        );
    }
}
