using backend.Models;
using backend.Requests.LostItems;

namespace backend.Services.LostItems;

public interface ILostItemsService
{
    // ! ADMIN PANEL ONLY
    Task<List<LostItem>> GetAll();

    // ! ADMIN PANEL ONLY
    Task<List<LostItem>> GetAllByUniversityId(Guid universityId);

    // MOBILE APP ONLY
    Task<List<LostItem>> GetAllLostItemsCreatedByStudent(Guid studentId);

    // ! ADMIN PANEL ONLY
    Task<LostItem?> GetById(Guid id);

    // ! ADMIN PANEL ONLY
    Task<LostItem> Create(CreateLostItemRequest request);

    // MOBILE APP ONLY
    Task<LostItem> CreateLostItemByStudent(Guid studentId, CreateLostItemByStudentRequest request);

    // ! ADMIN PANEL ONLY
    Task<LostItem?> Update(Guid id, UpdateLostItemRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> Delete(Guid id);

    // ! ADMIN PANEL ONLY
    Task<bool> StudentExists(Guid id);

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    Task<bool> CategoryExists(int id);

    // ! ADMIN PANEL ONLY
    Task<Guid?> GetUniversityIdFromStudentId(Guid studentId);
}
