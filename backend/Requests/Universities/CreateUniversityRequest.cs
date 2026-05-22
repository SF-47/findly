namespace backend.Requests.Universities;

public record CreateUniversityRequest(
    string ShortName,
    string FullName,
    string Branch
);