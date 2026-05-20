using backend.Models;
using backend.Requests.Students;

namespace backend.Services.Students;

public interface IStudentServices
{
    Task<List<Student>> GetAll();
    Task<Student?> GetById(Guid id);
    Task<Student> Create(CreateStudentRequest request);
    Task<Student?> Update(Guid id, UpdateStudentRequest request);
    Task<bool> Delete(Guid id);

    Task<Student?> VerifyStudent(Guid id);

    // For CREATE
    Task<bool> EmailExists(string email);
    Task<bool> UniversityStudentIdExists(string universityName, string universityId);
    Task<bool> PhoneNbExists(string phoneNb);

    // For UPDATE
    Task<bool> EmailExistsForAnotherStudent(string email, Guid id);
    Task<bool> UniversityStudentIdExistsForAnotherStudent(
        string universityName,
        string universityId,
        Guid id
    );
    Task<bool> PhoneNbExistsForAnotherStudent(string phoneNb, Guid id);
}
