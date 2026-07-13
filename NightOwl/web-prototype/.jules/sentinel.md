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
## 2024-05-18 - Client-Side Validation is Security Theater
**Vulnerability:** Client-side validation applied to protect a database backend.
**Learning:** Client-side input validation (e.g., regex checks for UUIDs) does not protect backend database queries from injection attacks because it runs in the user's browser. The `@supabase/supabase-js` client automatically encodes inputs under the hood, making frontend regex checks redundant 'security theater'. True security validation and protection must be implemented on the backend (e.g., via PostgreSQL Row Level Security policies).
**Prevention:** Do not implement client-side input validation as a security measure for backend database queries.

## 2024-05-18 - Strip trailing API paths from Supabase URL
**Vulnerability:** Trailing API paths (like `/rest/v1/`) accidentally provided in the `VITE_SUPABASE_URL` environment variable cause authentication errors.
**Learning:** Hardcoded assumptions about the URL format provided via environment variables can lead to 404 errors during client initialization if the user provides an overly specific path.
**Prevention:** Strip known trailing paths from the Supabase URL on the client-side before passing it to `createClient`.
