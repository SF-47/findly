namespace backend.Requests.Students;

public record UpdateStudentRequest(
    string FullName,
    string Email,
    string UniversityId,
    string PhoneNumber,
    string UniversityCardImageUrl
);
