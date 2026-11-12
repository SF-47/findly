namespace backend.Responses.Auth;

// ! ADMIN PANEL ONLY
public record AdminLoginResponse(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    Guid? UniversityId,
    string? UniversityShortName,
    string? UniversityFullName,
    string? UniversityBranch,
    string Token
);
