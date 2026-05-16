using backend.Models;
using backend.Requests.FoundItems;

namespace backend.Services.FoundItems;

public interface IFoundItemService
{
    Task<List<FoundItem>> GetAll();
    Task<FoundItem?> GetById(int id);
    Task<FoundItem> Create(CreateFoundItemRequest request);
    Task<FoundItem?> Update(int id, UpdateFoundItemRequest request);
    Task<bool> Delete(int id);
    Task<bool> StudentExists(int id);
    Task<bool> CategoryExists(int id);
}
