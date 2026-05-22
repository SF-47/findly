namespace backend.Responses.Universities;

public record UniversityResponse(
    Guid Id,
    string ShortName,
    string FullName,
    string Branch,
    DateTime CreatedAt
);
