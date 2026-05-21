namespace backend.Responses.Universities;

public record UniversityResponse(Guid Id, string Name, string Branch, DateTime CreatedAt);
