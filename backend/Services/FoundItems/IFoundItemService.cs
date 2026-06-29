using backend.Models;
using backend.Requests.FoundItems;

namespace backend.Services.FoundItems;

public interface IFoundItemService
{
    // ! ADMIN PANEL ONLY
    Task<List<FoundItem>> GetAll();

    // ! ADMIN PANEL ONLY
    Task<List<FoundItem>> GetAllByUniversityId(Guid universityId);

    // ! ADMIN PANEL ONLY
    Task<FoundItem?> GetById(Guid id);

    // MOBILE APP ONLY
    Task<List<FoundItem>> GetAllFoundItemsCreatedByStudent(Guid studentId);

    // ! ADMIN PANEL ONLY
    Task<FoundItem> Create(CreateFoundItemRequest request);

    // MOBILE APP ONLY
    Task<FoundItem> CreateFoundItemByStudent(
        Guid studentId,
        CreateFoundItemByStudentRequest request
    );

    // ! ADMIN PANEL ONLY
    Task<FoundItem?> Update(Guid id, UpdateFoundItemRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> Delete(Guid id);

    // ! ADMIN PANEL ONLY
    Task<bool> StudentExists(Guid id);

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    Task<bool> CategoryExists(int id);

    // ! ADMIN PANEL ONLY
    Task<Guid?> GetUniversityIdFromStudentId(Guid studentId);
}
