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

## 2024-05-24 - Unauthenticated Supabase Edge Functions for Internal Tasks
**Vulnerability:** Supabase Edge Function `daily-cleanup` was using `SUPABASE_SERVICE_ROLE_KEY` to perform administrative tasks (logical deletion of posts, messages, and closing voice rooms) but lacked any explicit authentication check in its request handling, allowing anyone to trigger it.
**Learning:** Supabase Edge Functions intended for internal or scheduled tasks (e.g., cron jobs) do not inherently enforce authentication. Relying solely on the function's internal use of the service role key for database operations without protecting the endpoint itself exposes a significant risk of unauthorized execution.
**Prevention:** Always implement explicit authentication checks (e.g., verifying the `Authorization` header against a known secret like `SUPABASE_SERVICE_ROLE_KEY`) within the Edge Function's logic to prevent unauthorized triggering, even if the function is only intended for internal use via pg_cron or Supabase Scheduler.
