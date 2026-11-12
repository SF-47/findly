namespace backend.Responses.Admins;

// ! ADMIN PANEL ONLY
public record AdminResponse(
    Guid Id,
    string FullName,
    string Email,
    string PhoneNumber,
    string Role,
    Guid? UniversityId,
    string? UniversityShortName,
    string? UniversityFullName,
    string? UniversityBranch,
    DateTime CreatedAt
);
