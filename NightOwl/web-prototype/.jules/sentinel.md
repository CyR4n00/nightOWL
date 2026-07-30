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

## 2026-07-30 - Prevent PostgREST Cartesian Product Injection in Supabase
**Vulnerability:** Supabase PostgREST client code using `.or()` with string interpolated query filters like `.or(\`and(sender_id.eq.${userId},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${userId})\`)` can be vulnerable to injection or result in unintended Cartesian product combinations.
**Learning:** This approach attempts to query both sending and receiving permutations in a single query but creates Cartesian products that expand matches incorrectly, along with using unsafe string interpolation over secure object-based query filters.
**Prevention:** Avoid string interpolation in `.or()` queries when filtering permutations. Instead, execute two separate `.eq()` queries (one for each logical branch) using `Promise.all()` concurrently. Then combine, sort, and slice the results client-side for deterministic, secure behavior without injection risks.
