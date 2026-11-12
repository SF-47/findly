using backend.Data;
using backend.Responses.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Dashboard;

// ! ADMIN PANEL ONLY
public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardSummaryResponse> GetSummary(bool isOwner, Guid? universityId)
    {
        if (!isOwner && universityId is null)
        {
            throw new Exception("University ID is required for university admin dashboard.");
        }

        if (isOwner)
        {
            var totalStudents = await _db.Students.CountAsync();

            var verifiedStudents = await _db.Students.CountAsync(s => s.IsVerified);

            var pendingStudents = await _db.Students.CountAsync(s => !s.IsVerified);

            var totalCategories = await _db.Categories.CountAsync();

            var lostItems = await _db.LostItems.CountAsync();

            var foundItems = await _db.FoundItems.CountAsync();

            var matches = await _db.Matches.CountAsync();

            var totalUniversities = await _db.Universities.CountAsync();

            return new DashboardSummaryResponse(
                totalStudents,
                verifiedStudents,
                pendingStudents,
                totalCategories,
                lostItems,
                foundItems,
                matches,
                totalUniversities
            );
        }
        else
        {
            var totalStudents = await _db.Students.CountAsync(s =>
                s.UniversityId == universityId!.Value
            );

            var verifiedStudents = await _db.Students.CountAsync(s =>
                s.UniversityId == universityId!.Value && s.IsVerified
            );

            var pendingStudents = await _db.Students.CountAsync(s =>
                s.UniversityId == universityId!.Value && !s.IsVerified
            );

            var totalCategories = await _db.Categories.CountAsync();

            var lostItems = await _db.LostItems.CountAsync(l =>
                l.Student.UniversityId == universityId!.Value
            );

            var foundItems = await _db.FoundItems.CountAsync(f =>
                f.Student.UniversityId == universityId!.Value
            );

            var matches = await _db
                .Matches.Include(m => m.LostItem)
                    .ThenInclude(l => l.Student)
                .CountAsync(m => m.LostItem.Student.UniversityId == universityId);

            var totalUniversities = 1;

            return new DashboardSummaryResponse(
                totalStudents,
                verifiedStudents,
                pendingStudents,
                totalCategories,
                lostItems,
                foundItems,
                matches,
                totalUniversities
            );
        }
    }
}
