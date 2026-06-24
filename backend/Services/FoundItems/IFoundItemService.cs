using backend.Models;
using backend.Requests.FoundItems;

namespace backend.Services.FoundItems;

public interface IFoundItemService
{
    Task<List<FoundItem>> GetAll();
    Task<List<FoundItem>> GetAllByUniversityId(Guid universityId);
    Task<FoundItem?> GetById(Guid id);
    Task<List<FoundItem>> GetAllFoundItemsCreatedByStudent(Guid studentId);
    Task<FoundItem> Create(CreateFoundItemRequest request);
    Task<FoundItem> CreateFoundItemByStudent(
        Guid studentId,
        CreateFoundItemByStudentRequest request
    );
    Task<FoundItem?> Update(Guid id, UpdateFoundItemRequest request);
    Task<bool> Delete(Guid id);
    Task<bool> StudentExists(Guid id);
    Task<bool> CategoryExists(int id);
    Task<Guid?> GetUniversityIdFromStudentId(Guid studentId);
}
