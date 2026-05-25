using System.Text;
using backend.Data;
using backend.Services.Admins;
using backend.Services.Auth;
using backend.Services.Categories;
using backend.Services.Dashboard;
using backend.Services.FoundItems;
using backend.Services.Jwt;
using backend.Services.LostItems;
using backend.Services.Students;
using backend.Services.Universities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("SupabaseDb"));
});

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IStudentServices, StudentServices>();
builder.Services.AddScoped<ILostItemsService, LostItemsServices>();
builder.Services.AddScoped<IFoundItemService, FoundItemsServices>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IUniversityService, UniversityService>();
builder.Services.AddScoped<IDashboardService,DashboardService>();
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
        }
    );
});

//This part reads the JWT settings in (appsettings.json)
//JwtService uses these values to create the token.
//Program.cs uses the same values to verify the token.
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

//This part checks that the key exists
//Because if the key is missing, token validation cannot work
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new Exception("JWT Key is missing.");
}

//This part enables authentication
//Use JWT Bearer as the default login-checking system
//When an endpoint has [Authorize] , ASP.NET will use JWT Bearer to check the request
builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    //This part configures how to check the token
    //When a token arrives, validate it using these rules.
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, //This checks : Who created this token?
            ValidateAudience = true, //This checks : Who is this token for?
            ValidateLifetime = true, //This checks : Is the token expired? //i set : "ExpiresInMinutes": 120 //So after 120 minutes, the token is rejected.
            ValidateIssuerSigningKey = true, //This checks : Was this token signed using our secret key?
            //Was the token changed?

            ValidIssuer = jwtIssuer, //Issuer = SmartLostAndFoundApi
            ValidAudience = jwtAudience, //Audience = SmartLostAndFoundAdminPanel
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.Zero, //If token expires at 10:00, it is invalid exactly at 10:00.
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet(
    "/",
    () =>
    {
        return "Smart Lost & Found API is running.";
    }
);
app.UseCors("AllowFrontend");

app.UseAuthentication();
//This means : Read the token and check who the user is.
//UseAuthentication() reads the token and extracts:
// Admin Id
// Email
// Role
// UniversityId
app.UseAuthorization();
//This means : After knowing who the user is, check if they are allowed.
//Example : [Authorize] means Only logged-in users with valid token can access.
//Example : [Authorize(Roles = "Owner")] means Only logged-in admins with Role = Owner can access.

app.MapControllers();

app.Run();
