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
## 2025-02-13 - PostgREST Injection in Supabase Queries
**Vulnerability:** Found string interpolation used inside a `.or()` Supabase PostgREST query (`.or(\`and(sender_id.eq.${userId},...)\`)`) which could allow a malicious user to inject arbitrary filters.
**Learning:** This existed because complex AND/OR logic in PostgREST can be verbose to write with the query builder, leading developers to rely on raw string interpolation which is unsafe. Furthermore, constructing a `.in()` query (e.g., `.in('sender_id', [userA, userB]).in('receiver_id', [userA, userB])`) to solve this creates a Cartesian product that incorrectly expands the match to include self-messages.
**Prevention:** Always use parameterized builder functions (e.g., `.eq()`). For complex bipartite queries (like 1-on-1 chats), execute separate concurrent `.eq()` queries using `Promise.all()` and merge the results client-side instead of writing raw string filters.
