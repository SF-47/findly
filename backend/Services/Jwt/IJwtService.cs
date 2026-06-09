using backend.Models;

namespace backend.Services.Jwt;

public interface IJwtService
{
    string GenerateToken(Admin admin);
    string GenerateStudentToken(Student student);
}