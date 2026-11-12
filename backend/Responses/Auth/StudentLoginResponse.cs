namespace backend.Responses.Auth;

// MOBILE APP ONLY
public record StudentLoginResponse(
    Guid Id,
    string FullName,
    string Email,
    Guid UniversityId,
    string UniversityShortName,
    string UniversityFullName,
    string UniversityBranch,
    bool IsVerified,
    string Token
);