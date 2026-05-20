using backend.Models;
using backend.Requests.FoundItems;

namespace backend.Services.FoundItems;

public interface IFoundItemService
{
    Task<List<FoundItem>> GetAll();
    Task<FoundItem?> GetById(Guid id);
    Task<FoundItem> Create(CreateFoundItemRequest request);
    Task<FoundItem?> Update(Guid id, UpdateFoundItemRequest request);
    Task<bool> Delete(Guid id);
    Task<bool> StudentExists(Guid id);
    Task<bool> CategoryExists(int id);
}
