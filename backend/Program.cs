using backend.Data;
using backend.Services.Categories;
using backend.Services.FoundItems;
using backend.Services.LostItems;
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
builder.Services.AddScoped<ILostItemsService, LostItemsServices>();
builder.Services.AddScoped<IFoundItemService, FoundItemsServices>();
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
app.MapControllers();

app.Run();
