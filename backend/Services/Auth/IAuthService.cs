using backend.Models;
using backend.Requests.Auth;

namespace backend.Services.Auth;

public interface IAuthService
{
    Task<Admin?> Login(AdminLoginRequest request);
    
}
