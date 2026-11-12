namespace backend.Responses.Universities;

// SHARED: USED BY BOTH ADMIN PANEL AND MOBILE APP
public record UniversityResponse(
    Guid Id,
    string ShortName,
    string FullName,
    string Branch,
    DateTime CreatedAt
);
