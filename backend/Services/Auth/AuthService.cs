using backend.Data;
using backend.Models;
using backend.Requests.Auth;
using BCrypt;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Auth;

public class AuthService : IAuthService
{
    public readonly AppDbContext _db;

    public AuthService(AppDbContext db)
    {
        _db = db;
    }

    // ! ADMIN PANEL ONLY
    public async Task<Admin?> Login(AdminLoginRequest request)
    {
        var admin = await _db
            .Admins.Include(a => a.University)
            .FirstOrDefaultAsync(a => a.Email.ToLower() == request.Email.Trim().ToLower());

        if (admin is null)
        {
            return null;
        }

        var passwordIsCorrect = BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash);

        if (!passwordIsCorrect)
        {
            return null;
        }

        return admin;
    }

    // ! ADMIN PANEL ONLY
    public async Task<bool> ChangePassword(Guid adminId, ChangePasswordRequest request)
    {
        var admin = await _db.Admins.FirstOrDefaultAsync(a => a.Id == adminId);
        if (admin is null)
        {
            return false;
        }

        var currentPasswordIsCorrect = BCrypt.Net.BCrypt.Verify(
            request.CurrentPassword,
            admin.PasswordHash
        );

        if (!currentPasswordIsCorrect)
        {
            return false;
        }

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _db.SaveChangesAsync();

        return true;
    }

    // MOBILE APP ONLY
    public async Task<Student?> LoginStudent(StudentLoginRequest request)
    {
        var email = request.Email.Trim().ToLower();
        var student = await _db
            .Students.Include(s => s.University)
            .FirstOrDefaultAsync(s => s.Email == email);

        if (student == null)
        {
            return null;
        }

        var isPasswordCorrect = BCrypt.Net.BCrypt.Verify(request.Password, student.PasswordHash);

        if (!isPasswordCorrect)
        {
            return null;
        }

        return student;
    }

    // MOBILE APP ONLY
    public async Task<Student?> RegisterStudent(StudentRegisterRequest request)
    {
        var fullName = request.FullName.Trim();
        var email = request.Email.Trim().ToLower();
        var phoneNumber = request.PhoneNumber.Trim();
        var universityStudentId = request.UniversityStudentId.Trim();
        var universityCardImageUrl = request.UniversityCardImageUrl.Trim();

        var emailExists = await _db.Students.AnyAsync(s => s.Email == email);

        if (emailExists)
        {
            return null;
        }

        var phoneExists = await _db.Students.AnyAsync(s => s.PhoneNumber == phoneNumber);

        if (phoneExists)
        {
            return null;
        }

        var universityExists = await _db.Universities.AnyAsync(u => u.Id == request.UniversityId);

        if (!universityExists)
        {
            return null;
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var studentIdExistsInUniversity = await _db.Students.AnyAsync(s =>
            s.UniversityId == request.UniversityId && s.UniversityStudentId == universityStudentId
        );

        if (studentIdExistsInUniversity)
        {
            return null;
        }

        var student = new Student
        {
            Id = Guid.NewGuid(),
            FullName = fullName,
            Email = email,
            PhoneNumber = phoneNumber,
            PasswordHash = passwordHash,
            UniversityId = request.UniversityId,
            UniversityStudentId = universityStudentId,
            UniversityCardImageUrl = universityCardImageUrl,
            IsVerified = false,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Add(student);
        await _db.SaveChangesAsync();

        var createdStudent = await _db
            .Students.Include(s => s.University)
            .FirstOrDefaultAsync(s => s.Id == student.Id);

        return createdStudent;
    }
}
