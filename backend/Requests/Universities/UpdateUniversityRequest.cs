namespace backend.Requests.Universities;

// ! ADMIN PANEL ONLY
public record UpdateUniversityRequest(string ShortName, string FullName, string Branch);
