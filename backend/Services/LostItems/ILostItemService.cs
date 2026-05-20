using backend.Models;
using backend.Requests.LostItems;

namespace backend.Services.LostItems;

public interface ILostItemsService
{
    Task<List<LostItem>> GetAll();
    Task<LostItem?> GetById(Guid id);
    Task<LostItem> Create(CreateLostItemRequest request);
    Task<LostItem?> Update(Guid id , UpdateLostItemRequest request);
    Task<bool> Delete(Guid id);
    Task<bool> StudentExists(Guid id);
    Task<bool> CategoryExists(int id);
}