using backend.Models;
using backend.Requests.Auth;

namespace backend.Services.Auth;

public interface IAuthService
{
    // ! ADMIN PANEL ONLY
    Task<Admin?> Login(AdminLoginRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> ChangePassword(Guid adminId, ChangePasswordRequest request);

    // MOBILE APP ONLY
    Task<Student?> LoginStudent(StudentLoginRequest request);

    // MOBILE APP ONLY
    Task<Student?> RegisterStudent(StudentRegisterRequest request);
}
