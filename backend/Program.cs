using backend.Data;
using backend.Services.Categories;
using backend.Services.Students;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("SupabaseDb"));
});

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IStudentServices, StudentServices>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () =>
{
    return "Smart Lost & Found API is running.";
});

app.MapControllers();

app.Run();
