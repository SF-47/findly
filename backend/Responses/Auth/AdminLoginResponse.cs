namespace backend.Responses.Auth;

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
