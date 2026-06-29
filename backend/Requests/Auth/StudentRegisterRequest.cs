namespace backend.Requests.Auth;

// MOBILE APP ONLY
public record StudentRegisterRequest(
    string FullName,
    string Email,
    string Password,
    string PhoneNumber,
    Guid UniversityId,
    string UniversityStudentId,
    string UniversityCardImageUrl
);