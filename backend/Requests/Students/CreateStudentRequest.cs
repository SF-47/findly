namespace backend.Requests.Students;

public record CreateStudentRequest(
    string FullName,
    string Email,
    string UniversityName,
    string UniversityId,
    string PhoneNumber,
    string UniversityCardImageUrl
);
