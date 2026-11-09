using System.Net;
using System.Security.Claims;
using System.Text;
using backend.Controllers;
using backend.Data;
using backend.Models;
using backend.Services.Storage;
using backend.Services.Students;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;

namespace backend.Tests;

/// <summary>
/// University ID cards live in a private bucket. Admins get a short-lived signed link,
/// only for students they are allowed to see.
/// </summary>
public class UniversityCardAccessTests
{
    private const string Base = "https://proj.supabase.co";
    private const string StoredUrl = Base + "/storage/v1/object/public/universities-cards/students/1700000000-abc.jpg";

    private sealed class FakeStorage : HttpMessageHandler
    {
        public List<HttpRequestMessage> Requests { get; } = [];

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
        {
            Requests.Add(request);
            var body = """{"signedURL":"/object/sign/universities-cards/students/1700000000-abc.jpg?token=t0k3n"}""";
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(body, Encoding.UTF8, "application/json") });
        }
    }

    private static (StorageUrlSigner signer, FakeStorage http) Signer(bool configured = true)
    {
        var settings = new Dictionary<string, string?>();
        if (configured)
        {
            settings["Supabase:Url"] = Base;
            settings["Supabase:ServiceRoleKey"] = "service-key";
        }
        var http = new FakeStorage();
        var config = new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
        return (new StorageUrlSigner(new HttpClient(http), config, NullLogger<StorageUrlSigner>.Instance), http);
    }

    [Fact]
    public async Task Signs_a_card_stored_in_our_bucket()
    {
        var (signer, http) = Signer();

        var url = await signer.SignUniversityCardAsync(StoredUrl);

        Assert.Equal(Base + "/storage/v1/object/sign/universities-cards/students/1700000000-abc.jpg?token=t0k3n", url);
        var req = Assert.Single(http.Requests);
        Assert.Equal(HttpMethod.Post, req.Method);
        Assert.Equal(Base + "/storage/v1/object/sign/universities-cards/students/1700000000-abc.jpg", req.RequestUri!.ToString());
        Assert.Equal("Bearer service-key", req.Headers.Authorization!.ToString());
    }

    [Fact]
    public async Task Leaves_links_outside_our_bucket_unchanged()
    {
        var (signer, http) = Signer();
        Assert.Equal("https://example.com/card.jpg", await signer.SignUniversityCardAsync("https://example.com/card.jpg"));
        Assert.Empty(http.Requests);
    }

    [Theory]
    [InlineData(Base + "/storage/v1/object/public/universities-cards/../items/x.jpg")]
    [InlineData(Base + "/storage/v1/object/public/universities-cards/students/%2e%2e/x.jpg")]
    [InlineData("")]
    public async Task Refuses_suspicious_or_empty_paths(string stored)
    {
        var (signer, http) = Signer();
        Assert.Null(await signer.SignUniversityCardAsync(stored));
        Assert.Empty(http.Requests);
    }

    [Fact]
    public async Task Without_storage_config_it_falls_back_to_the_stored_link()
    {
        var (signer, http) = Signer(configured: false);
        Assert.Equal(StoredUrl, await signer.SignUniversityCardAsync(StoredUrl));
        Assert.Empty(http.Requests);
    }

    // ---- endpoint: tenant isolation ----

    private static (StudentController controller, FakeStorage http) EndpointAs(AppDbContext db, string role, Guid? universityId)
    {
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()), new(ClaimTypes.Role, role) };
        if (universityId is { } u) claims.Add(new Claim("universityId", u.ToString()));
        var (signer, http) = Signer();
        var controller = new StudentController(new StudentServices(db), null!, null!, null!, null!, signer)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test")) } },
        };
        return (controller, http);
    }

    private static (AppDbContext db, Student student, Guid uniA, Guid uniB) SeedStudent()
    {
        var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        var uniA = new University { Id = Guid.NewGuid(), ShortName = "A" };
        var uniB = new University { Id = Guid.NewGuid(), ShortName = "B" };
        var student = new Student { Id = Guid.NewGuid(), FullName = "Karim", UniversityId = uniA.Id, UniversityCardImageUrl = StoredUrl };
        db.AddRange(uniA, uniB, student);
        db.SaveChanges();
        return (db, student, uniA.Id, uniB.Id);
    }

    [Fact]
    public async Task Admin_of_the_students_university_gets_a_signed_link()
    {
        var (db, student, uniA, _) = SeedStudent();
        var (controller, _) = EndpointAs(db, "UniversityAdmin", uniA);

        var ok = Assert.IsType<OkObjectResult>(await controller.GetUniversityCard(student.Id));
        Assert.Contains("token=t0k3n", System.Text.Json.JsonSerializer.Serialize(ok.Value));
    }

    [Fact]
    public async Task Owner_gets_a_signed_link_for_any_university()
    {
        var (db, student, _, _) = SeedStudent();
        var (controller, _) = EndpointAs(db, "Owner", null);
        Assert.IsType<OkObjectResult>(await controller.GetUniversityCard(student.Id));
    }

    [Fact]
    public async Task Admin_of_another_university_is_refused_and_nothing_is_signed()
    {
        var (db, student, _, uniB) = SeedStudent();
        var (controller, http) = EndpointAs(db, "UniversityAdmin", uniB);

        Assert.IsType<ForbidResult>(await controller.GetUniversityCard(student.Id));
        Assert.Empty(http.Requests);
    }

    [Fact]
    public async Task Students_cannot_fetch_cards()
    {
        var (db, student, uniA, _) = SeedStudent();
        var (controller, http) = EndpointAs(db, "Student", uniA);

        Assert.IsType<ForbidResult>(await controller.GetUniversityCard(student.Id));
        Assert.Empty(http.Requests);
    }
}
