using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("student-actions")]
    public class StudentActionsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public StudentActionsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /student-actions/support-contact
        [HttpGet("support-contact")]
        public async Task<IActionResult> GetSupportContact()
        {
            var studentIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(studentIdStr, out var studentId)) return Unauthorized();

            var student = await _db.Students.FindAsync(studentId);
            if (student == null) return NotFound("Student not found.");

            // Find the administrator of this student's university
            var admin = await _db.Admins
                .Where(a => a.UniversityId == student.UniversityId && a.Role == "UniversityAdmin")
                .FirstOrDefaultAsync();

            if (admin == null)
            {
                // Fallback to Owner/Global Admin if no university admin exists
                admin = await _db.Admins
                    .Where(a => a.Role == "Owner")
                    .FirstOrDefaultAsync();
            }

            if (admin == null) return NotFound("No support contact available.");

            return Ok(new
            {
                admin.FullName,
                admin.Email,
                admin.PhoneNumber
            });
        }
    }
}
