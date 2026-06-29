using backend.Models;

namespace backend.Services.Jwt;

public interface IJwtService
{
    // ! ADMIN PANEL ONLY
    string GenerateToken(Admin admin);

    // MOBILE APP ONLY
    string GenerateStudentToken(Student student);
}
