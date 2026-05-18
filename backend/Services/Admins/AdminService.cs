using backend.Data;
using backend.Models;
using backend.Requests.Admins;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Admins;

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Admin>> GetAll()
    {
        return await _db.Admins
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> EmailExists(string email)
    {
        return await _db.Admins.AnyAsync(a =>
            a.Email.ToLower() == email.Trim().ToLower()
        );
    }

    public async Task<Admin> Create(CreateAdminRequest request)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var admin = new Admin
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _db.Admins.Add(admin);

        await _db.SaveChangesAsync();

        return admin;
    }
}