using backend.Models;
using backend.Requests.Students;

namespace backend.Services.Students;

public interface IStudentServices
{
    // ! ADMIN PANEL ONLY
    Task<List<Student>> GetAll();

    // ! ADMIN PANEL ONLY
    Task<Student?> GetById(Guid id);

    // MOBILE APP ONLY
    Task<Student?> GetCurrentStudent(Guid studentId);

    // ! ADMIN PANEL ONLY
    Task<List<Student>> GetByUniversityId(Guid universityId);

    // ! ADMIN PANEL ONLY
    Task<Student> Create(CreateStudentRequest request);

    // ! ADMIN PANEL ONLY
    Task<Student?> Update(Guid id, UpdateStudentRequest request);

    // ! ADMIN PANEL ONLY
    Task<bool> Delete(Guid id);

    // ! ADMIN PANEL ONLY
    Task<Student?> VerifyStudent(Guid id);

    // ! ADMIN PANEL ONLY
    Task<bool> EmailExists(string email);

    // ! ADMIN PANEL ONLY
    Task<bool> PhoneNbExists(string phoneNb);

    // ! ADMIN PANEL ONLY
    Task<bool> UniversityExists(Guid universityId);

    // ! ADMIN PANEL ONLY
    Task<bool> UniversityStudentIdExists(Guid universityId, string universityStudentId);

    // ! ADMIN PANEL ONLY
    Task<bool> EmailExistsForAnotherStudent(string email, Guid id);

    // SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
    Task<bool> PhoneNbExistsForAnotherStudent(string phoneNb, Guid id);

    // ! ADMIN PANEL ONLY
    Task<bool> UniversityStudentIdExistsForAnotherStudent(
        Guid universityId,
        string universityStudentId,
        Guid id
    );

    // MOBILE APP ONLY
    Task<Student?> UpdateStudentOwnInfo(Guid studentId, UpdateStudentOwnInfo request);
}
