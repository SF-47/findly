using backend.Models;
using backend.Requests.Auth;

namespace backend.Services.Auth;

public interface IAuthService
{
    Task<Admin?> Login(AdminLoginRequest request);
    Task<bool> ChangePassword(Guid adminId, ChangePasswordRequest request);

    Task<Student?> LoginStudent(StudentLoginRequest request);
    Task<Student?> RegisterStudent(StudentRegisterRequest request);
}
