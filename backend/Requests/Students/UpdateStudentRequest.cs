namespace backend.Requests.Students;

public record UpdateStudentRequest(
    string FullName,
    string Email,
    Guid UniversityId,
    string UniversityStudentId,
    string PhoneNumber,
    string UniversityCardImageUrl
);