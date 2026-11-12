namespace backend.Requests.Students;

// ! ADMIN PANEL ONLY
public record UpdateStudentRequest(
    string FullName,
    string Email,
    Guid UniversityId,
    string UniversityStudentId,
    string PhoneNumber,
    string UniversityCardImageUrl
);
