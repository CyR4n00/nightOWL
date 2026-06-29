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

## 2026-06-29 - [PostgREST Injection via String Interpolation]
**Vulnerability:** String interpolation in Supabase PostgREST `.or()` filters (e.g. `.or(\`and(id.eq.${userId})...\`)`) allowed for PostgREST injection attacks since IDs were not strictly parameterized or validated.
**Learning:** Supabase JS SDK does not automatically parameterize string literals passed into filters like `.or()`, leaving them vulnerable if malicious strings (e.g. containing `,` or `()`) are used.
**Prevention:** Strictly validate dynamically interpolated parameters (like user IDs) with a safe format regex (e.g., `/^[a-zA-Z0-9-]+$/`) before executing the query, or use array/object-based filters where parameterization is handled natively if possible.
