namespace backend.Requests.Students;

public record UpdateStudentRequest(
    string FullName,
    string Email,
    string UniversityName,
    string UniversityId,
    string PhoneNumber,
    string UniversityCardImageUrl
);
