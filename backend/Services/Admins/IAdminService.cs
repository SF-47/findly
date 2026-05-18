using backend.Models;
using backend.Requests.Admins;

namespace backend.Services.Admins;

public interface IAdminService
{
    Task<List<Admin>> GetAll();

    Task<bool> EmailExists(string email);

    Task<Admin> Create(CreateAdminRequest request);
}