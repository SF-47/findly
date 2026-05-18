using backend.Data;
using backend.Models;
using backend.Requests.Auth;
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
        var admin = await _db.Admins.FirstOrDefaultAsync(a =>
            a.Email.ToLower() == request.Email.Trim().ToLower()
        );

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
}
