using backend.Models;
using backend.Requests.Universities;

namespace backend.Services.Universities;

public interface IUniversityService
{
    Task<List<University>> GetAll();

    Task<University?> GetById(Guid id);

    Task<University> Create(CreateUniversityRequest request);

    Task<University?> Update(Guid id, UpdateUniversityRequest request);

    Task<bool> Delete(Guid id);

    Task<bool> ExistsByShortNameFullNameAndBranch(
        string shortName,
        string fullName,
        string branch
    );

    Task<bool> ExistsByShortNameFullNameAndBranchExceptId(
        Guid id,
        string shortName,
        string fullName,
        string branch
    );
}