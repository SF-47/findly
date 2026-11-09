using System.Net.Http.Headers;
using System.Text.RegularExpressions;

namespace backend.Services.Storage;

public interface IStorageUrlSigner
{
    /// <summary>
    /// Turns a stored university-card link into a short-lived signed URL.
    /// Links outside the private bucket are returned unchanged; unusable paths return null.
    /// </summary>
    Task<string?> SignUniversityCardAsync(string storedUrl);
}

/// <summary>
/// University ID cards are kept in the private "universities-cards" Supabase bucket. The database
/// still stores the original object link (".../object/public/universities-cards/..."), which is
/// only used here to find the object path. Signing needs the service-role key, so it only ever
/// happens on the server.
/// </summary>
public partial class StorageUrlSigner : IStorageUrlSigner
{
    public const string CardsBucket = "universities-cards";
    public static readonly TimeSpan LinkLifetime = TimeSpan.FromMinutes(5);

    private readonly HttpClient _http;
    private readonly ILogger<StorageUrlSigner> _logger;
    private readonly string? _baseUrl;
    private readonly string? _serviceKey;

    public StorageUrlSigner(HttpClient http, IConfiguration config, ILogger<StorageUrlSigner> logger)
    {
        _http = http;
        _logger = logger;
        _baseUrl = config["Supabase:Url"]?.TrimEnd('/');
        _serviceKey = config["Supabase:ServiceRoleKey"];
    }

    [GeneratedRegex(@"^[A-Za-z0-9._\-]+(/[A-Za-z0-9._\-]+)*$")]
    private static partial Regex SafePath();

    public async Task<string?> SignUniversityCardAsync(string storedUrl)
    {
        if (string.IsNullOrWhiteSpace(storedUrl))
            return null;

        if (string.IsNullOrEmpty(_baseUrl) || string.IsNullOrEmpty(_serviceKey))
        {
            _logger.LogWarning("Supabase:Url or Supabase:ServiceRoleKey is not set; returning the stored card link unsigned.");
            return storedUrl;
        }

        // Work on the raw string: System.Uri would silently resolve "../" segments.
        string[] prefixes =
        [
            $"{_baseUrl}/storage/v1/object/public/{CardsBucket}/",
            $"{_baseUrl}/storage/v1/object/{CardsBucket}/",
        ];
        var prefix = prefixes.FirstOrDefault(p => storedUrl.StartsWith(p, StringComparison.Ordinal));
        if (prefix is null)
            return storedUrl; // a link an admin entered by hand, not one of our objects

        var path = Uri.UnescapeDataString(storedUrl[prefix.Length..].Split('?', '#')[0]);
        if (!SafePath().IsMatch(path) || path.Split('/').Any(seg => seg is "." or ".."))
        {
            _logger.LogWarning("Refusing to sign a university card with an unexpected path.");
            return null;
        }

        var escaped = string.Join('/', path.Split('/').Select(Uri.EscapeDataString));
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/storage/v1/object/sign/{CardsBucket}/{escaped}")
        {
            Content = JsonContent.Create(new { expiresIn = (int)LinkLifetime.TotalSeconds }),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
        request.Headers.Add("apikey", _serviceKey);

        try
        {
            using var response = await _http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Signing a university card failed with status {Status}.", (int)response.StatusCode);
                return null;
            }

            var body = await response.Content.ReadFromJsonAsync<SignResponse>();
            return string.IsNullOrEmpty(body?.SignedURL) ? null : $"{_baseUrl}/storage/v1{body.SignedURL}";
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or System.Text.Json.JsonException)
        {
            _logger.LogWarning(ex, "Signing a university card failed.");
            return null;
        }
    }

    private sealed record SignResponse(string? SignedURL);
}
