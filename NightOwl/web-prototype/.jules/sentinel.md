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

## 2024-07-26 - PostgREST Injection Risk in Supabase `or` Filters
**Vulnerability:** The codebase was directly interpolating string variables (`userId` and `friend.id`) into a Supabase PostgREST `.or()` filter string. This created a severe injection risk where a malicious user could manipulate the string to execute unintended query logic and potentially access unauthorized data.
**Learning:** String interpolation inside `.or()` and `.and()` Supabase query parameters bypassing safe parameterization and directly exposes the application to PostgREST injection.
**Prevention:** Always validate parameters with strict regex constraints (e.g., UUID format verification) BEFORE they are interpolated into query strings. Or ideally, if the database schema allows, use native query builder methods rather than string syntax.
