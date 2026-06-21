## 2026-06-18 - [Information Leakage]
**Vulnerability:** Detailed authentication errors and database error details were exposed in the client console and UI.
**Learning:** Supabase default error responses can leak sensitive schema details or assist in username enumeration.
**Prevention:** Always use generic error messages for client-facing UI and prevent logging raw error objects (e.g., `JSON.stringify(error)`) in the browser console.

## 2026-06-18 - [Missing Input Length Limits]
**Vulnerability:** Input fields across the application lacked length limits and basic server-side or client-side validation.
**Learning:** Missing input constraints can lead to overly long input data, which may result in poor database performance, layout breaking, or denial of service (DoS) risks.
**Prevention:** Always add sensible `maxLength` attributes to text inputs and perform server/client-side validation to restrict unbounded user input length.
