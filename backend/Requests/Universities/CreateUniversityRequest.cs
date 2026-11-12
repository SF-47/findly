namespace backend.Requests.Universities;

// ! ADMIN PANEL ONLY
public record CreateUniversityRequest(string ShortName, string FullName, string Branch);
