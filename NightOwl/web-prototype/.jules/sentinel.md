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
## 2025-02-19 - Prevent SQL Injection via Template Literals in Supabase .or()
**Vulnerability:** Constructing Supabase `.or()` queries using raw string interpolation (e.g., `.or(\`and(sender_id.eq.${userId})...\`)`) introduces SQL injection vectors because the string is not parameterized by the client library.
**Learning:** Supabase's JS client `.or()` method accepts a raw PostgREST string without built-in parameterized variables. Dynamically building this string with untrusted inputs exposes the query. Additionally, attempting to fix this with `.in('sender', [A,B]).in('receiver', [A,B])` inadvertently creates a Cartesian product (matching self-messages).
**Prevention:** Avoid string interpolation in `.or()`. Instead, execute separate, parameterized `.eq()` queries concurrently using `Promise.all()`, then combine, sort, and slice the results client-side.
