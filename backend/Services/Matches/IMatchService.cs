using backend.Models;

namespace backend.Services.Matches;

public interface IMatchService 
{
    Task<List<ItemsMatch>> GetMatchesForStudent(Guid studentId);
}
