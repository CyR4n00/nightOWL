## 2026-06-18 - [Information Leakage]
**Vulnerability:** Detailed authentication errors and database error details were exposed in the client console and UI.
**Learning:** Supabase default error responses can leak sensitive schema details or assist in username enumeration.
**Prevention:** Always use generic error messages for client-facing UI and prevent logging raw error objects (e.g., `JSON.stringify(error)`) in the browser console.

## 2024-06-23 - [Input Validation]
**Vulnerability:** User inputs lacked maximum length constraints, creating risks for UI payload bloat, layout breaking, and Denial of Service (DoS).
**Learning:** React state tied to unconstrained text inputs can cause excessive memory usage and degraded performance if users paste massive strings.
**Prevention:** Consistently apply sensible `maxLength` attributes to all client-side `<input>` elements (e.g., chat, usernames, IDs, titles) as a foundational defense-in-depth measure.

## 2026-06-25 - [Information Exposure via Logging]
**Vulnerability:** Raw database and backend service error objects (e.g. Supabase and Agora errors) were being logged directly to the client-side console using console.error and console.warn.
**Learning:** Even if errors are not shown in the UI, exposing raw error objects in the browser console can leak sensitive database schema details, PostgREST internal states, or service configuration that attackers can use to craft targeted exploits.
**Prevention:** Always sanitize error logs on the client. Use generic string messages for console outputs in production code instead of passing the raw error object.

## 2024-07-06 - [PostgREST Injection Risk]
**Vulnerability:** Direct string interpolation of user IDs was used within Supabase PostgREST `.or()` query filters (`.or(\`and(sender_id.eq.${userId},...)\`)`).
**Learning:** Even though the IDs typically originate from auth systems, directly interpolating variables into PostgREST filter strings creates an injection vulnerability if an attacker manipulates the input to inject arbitrary SQL-like PostgREST syntax.
**Prevention:** Avoid direct string interpolation in PostgREST filters where possible by using chained SDK methods. If string filters must be used (e.g. for complex OR conditions), strictly validate all interpolated parameters (e.g. using a UUID regex) to ensure they contain only safe, expected characters before executing the query.
