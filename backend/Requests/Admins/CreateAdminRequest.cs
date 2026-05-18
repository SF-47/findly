namespace backend.Requests.Admins;

public record CreateAdminRequest(
    string FullName,
    string Email,
    string Password
    
);
