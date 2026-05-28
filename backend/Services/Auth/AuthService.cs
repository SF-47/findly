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

    public async Task<bool> ChangePassword(Guid adminId , ChangePasswordRequest request)
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
}
