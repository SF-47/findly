using backend.Models;
using backend.Requests.Students;

namespace backend.Services.Students;

public interface IStudentServices
{
    Task<List<Student>> GetAll();
    Task<Student?> GetById(Guid id);
    Task<Student?> GetCurrentStudent(Guid studentId);
    Task<List<Student>> GetByUniversityId(Guid universityId);
    Task<Student> Create(CreateStudentRequest request);
    Task<Student?> Update(Guid id, UpdateStudentRequest request);
    Task<bool> Delete(Guid id);
    Task<Student?> VerifyStudent(Guid id);
    Task<bool> EmailExists(string email);
    Task<bool> PhoneNbExists(string phoneNb);
    Task<bool> UniversityExists(Guid universityId);
    Task<bool> UniversityStudentIdExists(Guid universityId, string universityStudentId);
    Task<bool> EmailExistsForAnotherStudent(string email, Guid id);
    Task<bool> PhoneNbExistsForAnotherStudent(string phoneNb, Guid id);
    Task<bool> UniversityStudentIdExistsForAnotherStudent(
        Guid universityId,
        string universityStudentId,
        Guid id
    );
    Task<Student?> UpdateStudentOwnInfo(Guid studentId, UpdateStudentOwnInfo request);

    
}
