## 2026-06-18 - [Information Leakage]
**Vulnerability:** Detailed authentication errors and database error details were exposed in the client console and UI.
**Learning:** Supabase default error responses can leak sensitive schema details or assist in username enumeration.
**Prevention:** Always use generic error messages for client-facing UI and prevent logging raw error objects (e.g., `JSON.stringify(error)`) in the browser console.

## 2024-06-23 - [Input Validation]
**Vulnerability:** User inputs lacked maximum length constraints, creating risks for UI payload bloat, layout breaking, and Denial of Service (DoS).
**Learning:** React state tied to unconstrained text inputs can cause excessive memory usage and degraded performance if users paste massive strings.
**Prevention:** Consistently apply sensible `maxLength` attributes to all client-side `<input>` elements (e.g., chat, usernames, IDs, titles) as a foundational defense-in-depth measure.

## 2024-06-24 - [Information Exposure in Client Logs]
**Vulnerability:** Sensitive information, such as API keys and detailed database error objects, were logged to the browser console.
**Learning:** Logging raw credentials or backend errors directly to the client console exposes internal systems to anyone inspecting the frontend, potentially leaking API keys, database schemas, or internal state.
**Prevention:** Never log raw secrets, API keys, or full error objects in production or client-facing code. Use generic fallback messages for console errors, and strictly remove console statements that dump sensitive variables.
