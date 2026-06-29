namespace backend.Requests.Admins;

// ! ADMIN PANEL ONLY
public record CreateAdminRequest(
    string FullName,
    string Email,
    string PhoneNumber,
    string Password,
    string Role,
    Guid? UniversityId
);
