using backend.Models;
using backend.Requests.Admins;

namespace backend.Services.Admins;

// ! ADMIN PANEL ONLY
public interface IAdminService
{
    Task<List<Admin>> GetAll();
    Task<List<Admin>> GetAllExcept(Guid id);
    Task<bool> EmailExists(string email);
    Task<bool> PhoneExists(string phone);

    Task<Admin> Create(CreateAdminRequest request);
    Task<bool> Delete(Guid id);
}
