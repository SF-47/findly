namespace backend.Responses.Students;

public record FullStudentResponse(
    int Id,
    string FullName,
    string Email,
    string UniversityName,
    string UniversityId,
    string PhoneNumber,
    string UniversityCardImageUrl,
    bool IsVerified,
    DateTime CreatedAt
);
