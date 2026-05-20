using backend.Models;
using backend.Requests.Admins;

namespace backend.Services.Admins;

public interface IAdminService
{
    Task<List<Admin>> GetAll();

    Task<bool> EmailExists(string email);
    Task<bool> PhoneExists(string phone);

    Task<Admin> Create(CreateAdminRequest request);
}