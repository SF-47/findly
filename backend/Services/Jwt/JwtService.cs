using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims; //Stores user info inside token.
using System.Text;
using backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services.Jwt;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Admin admin)
    {
        //It reads:
        // Jwt:Key
        // Jwt:Issuer
        // Jwt:Audience
        // Jwt:ExpiresInMinutes
        // from configuration.
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];
        var expiresInMinutes = _configuration.GetValue<int>("Jwt:ExpiresInMinutes");

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new Exception("JWT Key is missing.");
        }
        //Claims are very important , They allow controllers to know:
        // who is the admin?
        // what is their email?
        // what is their role?
        // what university do they belong to?
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new Claim(ClaimTypes.Email, admin.Email),
            new Claim(ClaimTypes.Name, admin.FullName),
            new Claim(ClaimTypes.Role, admin.Role),//this enables : User.IsInRole("Owner") and User.IsInRole("UniversityAdmin")
            new Claim("universityId", admin.UniversityId?.ToString() ?? ""), //This lets university admins only access their own university data.
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)); //This creates the secret signing key.

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //This says : sign the token using HMAC SHA-256.

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);//converts it into a string sent to frontend.
    }
}
