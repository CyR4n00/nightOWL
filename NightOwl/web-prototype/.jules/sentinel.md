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
## 2026-06-25 - [SQL Injection Risk with PostgREST]
**Vulnerability:** User-controlled input variables were interpolated directly into a raw Supabase `.or()` query string. This allowed malicious input (like commas or parentheses) to bypass the intended filter structure, potentially exposing unauthorized records.
**Learning:** Supabase PostgREST `.or()` filters that rely on string concatenation bypass the automatic parameterization and URL-encoding protections provided by the standard builder methods.
**Prevention:** Avoid string interpolation in `.or()` queries. When dealing with complex OR logic involving dynamic inputs (like "A sent to B" OR "B sent to A"), execute multiple separate `.eq()` queries using `Promise.all()` and combine the results client-side, as `.eq()` inherently sanitizes inputs.
