namespace backend.Requests.Admins;

public record CreateAdminRequest(
    string FullName,
    string Email,
    string PhoneNumber,
    string Password,
    string Role,
    Guid? UniversityId
);