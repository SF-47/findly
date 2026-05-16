using backend.Models;
using backend.Requests.LostItems;

namespace backend.Services.LostItems;

public interface ILostItemsService
{
    Task<List<LostItem>> GetAll();
    Task<LostItem?> GetById(int id);
    Task<LostItem> Create(CreateLostItemRequest request);
    Task<LostItem?> Update(int id , UpdateLostItemRequest request);
    Task<bool> Delete(int id);
    Task<bool> StudentExists(int id);
    Task<bool> CategoryExists(int id);
}