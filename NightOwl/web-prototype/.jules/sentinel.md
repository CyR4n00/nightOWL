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

## 2024-07-03 - Prevent PostgREST Injection in Supabase Queries
**Vulnerability:** A PostgREST injection vulnerability existed in `src/views/PrivateChatView.tsx` due to direct string interpolation of user IDs in a Supabase `.or()` filter string. If malicious input was passed, it could manipulate the database query logic.
**Learning:** String interpolation should never be used to construct Supabase PostgREST queries (e.g. inside `.or("...")`), as it behaves similarly to raw SQL string concatenation, bypassing safe parameterization and enabling injection attacks.
**Prevention:** Always validate parameters before interpolating them into a PostgREST query string. Ensure inputs strictly match their expected type (e.g., verifying a UUID format with regex like `/^[a-zA-Z0-9-]+$/`) to safely abort execution if anomalous data is detected.
