## 2026-06-18 - [Information Leakage]
**Vulnerability:** Detailed authentication errors and database error details were exposed in the client console and UI.
**Learning:** Supabase default error responses can leak sensitive schema details or assist in username enumeration.
**Prevention:** Always use generic error messages for client-facing UI and prevent logging raw error objects (e.g., `JSON.stringify(error)`) in the browser console.

## 2024-06-19 - [Prevent Information Exposure Through Console Logs]
**Vulnerability:** Raw error objects (from Supabase queries, edge functions, etc.) were directly passed to `console.error` and `console.warn` in the client application (`HomeView.tsx`, `FriendChatView.tsx`, `PrivateChatView.tsx`, `VoiceRoomService.ts`).
**Learning:** Logging detailed database or network error objects to the client console can leak sensitive internal architecture details, database schema information, stack traces, and API behavior to an attacker observing the browser devtools.
**Prevention:** Always log generic, safe error messages to the client console and avoid passing raw Error or response objects directly to logging functions on the frontend.
