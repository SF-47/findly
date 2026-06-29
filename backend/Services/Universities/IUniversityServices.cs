using backend.Models;
using backend.Requests.Universities;

namespace backend.Services.Universities;

public interface IUniversityService
{
    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    Task<List<University>> GetAll();

    // ! ADMIN PANEL ONLY
    Task<University?> GetById(Guid id);

    // ! ADMIN PANEL ONLY
    Task<University> Create(CreateUniversityRequest request);

    // ! ADMIN PANEL ONLY
    Task<University?> Update(Guid id, UpdateUniversityRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> Delete(Guid id);

    // ! ADMIN PANEL ONLY
    Task<bool> ExistsByShortNameFullNameAndBranch(string shortName, string fullName, string branch);

    // ! ADMIN PANEL ONLY
    Task<bool> ExistsByShortNameFullNameAndBranchExceptId(
        Guid id,
        string shortName,
        string fullName,
        string branch
    );
}
