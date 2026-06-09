namespace backend.Requests.Students;

public record CreateStudentRequest(
    string FullName,
    string Email,
    string Password,
    Guid UniversityId,
    string UniversityStudentId,
    string PhoneNumber,
    string UniversityCardImageUrl
);
