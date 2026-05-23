namespace backend.Requests.Students;

public record CreateStudentRequest(
    string FullName,
    string Email,
    Guid UniversityId,
    string UniversityStudentId,
    string PhoneNumber,
    string UniversityCardImageUrl
);