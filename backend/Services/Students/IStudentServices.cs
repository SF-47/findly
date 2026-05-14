using backend.Models;
using backend.Requests.Students;

namespace backend.Services.Students;

public interface IStudentServices
{
    Task<List<Student>> GetAll();
    Task<Student?> GetById(int id);
    Task<Student> Create(CreateStudentRequest request);
    Task<Student?> Update(int id, UpdateStudentRequest request);
    Task<bool> Delete(int id);
    Task<bool> EmailExists(string email);
    Task<bool> UniIdExists(string uniId);
    Task<bool> PhoneNbExists(string phoneNb);

    Task<bool> EmailExistsForAnotherStudent(string email, int id);
    Task<bool> UniIdExistsForAnotherStudent(string uniId, int id);
    Task<bool> PhoneNbExistsForAnotherStudent(string phoneNb, int id);
}
