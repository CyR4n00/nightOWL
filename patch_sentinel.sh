cat << 'INNER_EOF' > NightOwl/web-prototype/.jules/sentinel.md
## 2026-06-18 - [Information Leakage]
**Vulnerability:** Detailed authentication errors and database error details were exposed in the client console and UI.
**Learning:** Supabase default error responses can leak sensitive schema details or assist in username enumeration.
**Prevention:** Always use generic error messages for client-facing UI and prevent logging raw error objects (e.g., \`JSON.stringify(error)\`) in the browser console.

## 2026-06-18 - [Missing Input Length Limits]
**Vulnerability:** Input fields across the application lacked length limits and basic server-side or client-side validation.
**Learning:** Missing input constraints can lead to overly long input data, which may result in poor database performance, layout breaking, or denial of service (DoS) risks.
**Prevention:** Always add sensible \`maxLength\` attributes to text inputs and perform server/client-side validation to restrict unbounded user input length.

## 2026-06-25 - [Information Exposure via Logging]
**Vulnerability:** Raw database and backend service error objects (e.g. Supabase and Agora errors) were being logged directly to the client-side console using console.error and console.warn.
**Learning:** Even if errors are not shown in the UI, exposing raw error objects in the browser console can leak sensitive database schema details, PostgREST internal states, or service configuration that attackers can use to craft targeted exploits.
**Prevention:** Always sanitize error logs on the client. Use generic string messages for console outputs in production code instead of passing the raw error object.
INNER_EOF
