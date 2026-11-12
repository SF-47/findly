namespace backend.Responses.Students;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record FullStudentResponse(
    Guid Id,
    string FullName,
    string Email,
    Guid UniversityId,
    string UniversityStudentId,
    string? UniversityShortName,
    string? UniversityFullName,
    string? UniversityBranch,
    string PhoneNumber,
    string UniversityCardImageUrl,
    bool IsVerified,
    DateTime CreatedAt
);