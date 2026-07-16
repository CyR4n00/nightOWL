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
## 2025-02-14 - Fix PostgREST SQL Injection Risk in PrivateChatView

**Vulnerability:** A filter injection risk was found in `PrivateChatView.tsx` where string interpolation was used within a `.or()` Supabase query filter (`.or(`and(sender_id.eq.${userId},receiver_id.eq.${friend.id})...`)`).

**Learning:** When using the Supabase client, constructing filter strings manually with variable interpolation bypasses the automatic parameterization provided by builder methods like `.eq()`. This creates a vulnerability similar to classic SQL injection if variables come from unsanitized sources. The attempt to fix this with `.in('sender_id', [userA, userB]).in('receiver_id', [userA, userB])` is a known anti-pattern that creates a Cartesian product, returning incorrect results (self-messages).

**Prevention:** Never use string interpolation inside Supabase query filters like `.or()`. To handle complex OR logic safely without Cartesian product issues, split the query into multiple parameterized queries using `.eq()` and execute them concurrently with `Promise.all()`, then combine and sort the results client-side.
