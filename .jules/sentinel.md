## 2024-05-28 - Removed Hardcoded Supabase and Agora Keys
**Vulnerability:** Hardcoded API keys and URL for Supabase and Agora were found in `src/lib/supabaseClient.ts` and `src/lib/agora/VoiceRoomService.ts` as fallback values, which risks them being committed to the repo.
**Learning:** Fallback values for secrets should not be hardcoded in the source code even if they are meant for local prototyping, as they easily end up in version control.
**Prevention:** Rely strictly on `import.meta.env` for accessing API keys. If keys are missing, either fall back to an empty string or gracefully notify the developer via `console.warn` without breaking module loading.
