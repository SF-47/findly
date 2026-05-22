using System.IdentityModel.Tokens.Jwt; // Tools/classes to create and write JWT tokens
using System.Security.Claims;          // Allows us to create "claims" = data stored inside token
using System.Text;                     // Used to convert the secret key string into bytes
using backend.Models;                  // To use the Admin model
using Microsoft.IdentityModel.Tokens;  // Security key + signing algorithm classes

namespace backend.Services.Jwt;

// This service is responsible for generating JWT tokens
public class JwtService : IJwtService
{
    // IConfiguration lets us read values from appsettings.json
    // Example: Jwt:Key, Jwt:Issuer, Jwt:Audience
    private readonly IConfiguration _configuration;

    // Constructor injection:
    // ASP.NET Core automatically gives us IConfiguration here
    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // This method receives the logged-in admin
    // and returns a JWT token as a string
    public string GenerateToken(Admin admin)
    {
        // Read JWT settings from appsettings.json
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        // Read token expiration time from appsettings.json
        // Example: 120 means token expires after 120 minutes
        var expiresInMinutes = _configuration.GetValue<int>("Jwt:ExpiresInMinutes");

        // If the secret key is missing, we stop immediately
        // Because without a key, we cannot safely sign the token
        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new Exception("JWT Key is missing.");
        }

        // Claims are the information we put inside the token
        // Think of them as the admin's ID card data
        var claims = new List<Claim>
        {
            // Admin ID
            // Later we can know which admin is making the request
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),

            // Admin email
            new Claim(ClaimTypes.Email, admin.Email),

            // Admin full name
            new Claim(ClaimTypes.Name, admin.FullName),

            // Admin role: Owner or UniversityAdmin
            // This is important later for [Authorize(Roles = "Owner")]
            new Claim(ClaimTypes.Role, admin.Role),

            // University ID
            // Owner has no university, so we store empty string
            // UniversityAdmin has a real university id
            new Claim("universityId", admin.UniversityId?.ToString() ?? "")
        };

        // Convert the secret key from text into a security key
        // The backend will use this key to sign the token
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        // Create signing credentials
        // This says:
        // "Sign the token using this secret key and HMAC SHA-256 algorithm"
        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        // Create the actual JWT token object
        var token = new JwtSecurityToken(
            issuer: jwtIssuer, // Who created the token? Our API
            audience: jwtAudience, // Who is this token for? The admin panel
            claims: claims, // The data stored inside the token
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes), // Expiry time
            signingCredentials: credentials // Signature information
        );

        // Convert the token object into a string
        // This string is what we send to the frontend
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}