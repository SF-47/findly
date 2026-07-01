using System.Text; //3am nesta3mela kermel al JWT bado Encoding.UTF8.GetBytes(jwtKey) , wl encoding... converts the JWT secret mn string into bytes
using backend.Data; //bta3tene access la AppDbContext
// using backend.Services... : Allows Program.cs to register your services.
using backend.Services.Admins;
using backend.Services.Auth;
using backend.Services.Categories;
using backend.Services.Dashboard;
using backend.Services.FoundItems;
using backend.Services.Jwt;
using backend.Services.LostItems;
using backend.Services.N8n;
using backend.Services.Students;
using backend.Services.Universities;
using Microsoft.AspNetCore.Authentication.JwtBearer; //Enables JWT Bearer authentication.
using Microsoft.EntityFrameworkCore; //Allows database setup with EF Core.
using Microsoft.IdentityModel.Tokens; //Used to configure JWT token validation.

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(); //hayde bt2ello la ASP.NET 2no hayda al project byesta3mel controllers mtl AuthController , LostItemsController ....

builder.Services.AddOpenApi();

//hayde hon ya3ne 3am 2ool Use PostgreSQL with the connection string named SupabaseDb
//AppDbContext is the EF Core class that represents your database.
//UseNpgsql means use PostgreSQL provider.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("SupabaseDb"));
    options.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

//hon 3am ba3mel register lal services li 2ele
//AddScoped means: Create one instance of this service per HTTP request , example : when LostItemController needs ILostItemService , ASP>NET automatically gives it LostItemsServices. This is called dependency injection.
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IStudentServices, StudentServices>();
builder.Services.AddScoped<ILostItemsService, LostItemsServices>();
builder.Services.AddScoped<IFoundItemService, FoundItemsServices>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IUniversityService, UniversityService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IN8nMatchingService, N8nMatchingService>();

builder.Services.AddHttpClient();

//Because after ASP.NET creates a lost/found item, it needs to send an HTTP request to n8n.
// Without HttpClient, the backend cannot trigger n8n.

//hon CORS controls which frontend can call my backend
//right now i am allowing everything , any orgin , any header , any method , but for deployment , i should restrict it to my real frontend domain.
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
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
//So if JWT key is missing, the backend stops immediately.
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

//This creates the actual running app.
//Before it, I configure services.
//After it, I configure middleware.

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); //Only expose OpenAPI in development.
}

app.MapGet(
    "/",
    () =>
    {
        return "Smart Lost & Found API is running.";
    }
); //Good for checking that the backend is alive.

//Middleware order (Order matters) :
app.UseCors("AllowFrontend"); //Allows frontend requests.

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

app.MapControllers();//Activates controller routes.
app.Run();//Starts the server
