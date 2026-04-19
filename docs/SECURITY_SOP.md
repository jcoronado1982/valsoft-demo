# 🛡️ SOP - Security & Resilience

## 🛡️ SQL Injection Prevention
- **Strategy**: 100% reliance on Entity Framework Core's parameterization.
- **Rule**: Avoid `FromSqlRaw` or `ExecuteSqlRaw` with interpolated strings. Use LINQ and `EF.Functions`.
- **Status**: Verified. Current implementation of Full-Text Search and Trigrams is secure.

## 🚧 Denial of Service (DoS) Mitigation
- **Middleware**: `Microsoft.AspNetCore.RateLimiting` is active in the backend.
- **Global Policy**: 100 requests per minute per client using a **Fixed Window** strategy.
- **Response**: Excess requests receive a `429 Too Many Requests` status code.

## 🔑 Authentication & Authorization
- **Protocol**: JWT (JSON Web Tokens).
- **Validation**: Strict validation of Issuer, Audience, and Lifetime.
- **Requirement**: Use `.RequireAuthorization()` on all business endpoints except Auth/Login.
- **Key Rotation**: In production, ensure the `Jwt:Key` is sourced from a secure Vault/Secret manager, not `appsettings.json`.

## 🌐 Frontend Security (XSS)
- **Framework protection**: Angular's default interpolation `{{ }}` escapes all HTML.
- **Sanitization**: Use `DomSanitizer` for rare cases where `[innerHTML]` is required. Always validate sources of dynamic icons/SVG.

---
> [!CAUTION]
> Never commit real production secrets to the repository. Use `.env.example` as a template.
