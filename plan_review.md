1. **Fix Supabase initialization error:** Update `src/lib/supabaseClient.ts` to use a dummy URL (`https://dummy.supabase.co`) and a dummy key as a fallback to prevent module-level evaluation crashes (`Uncaught Error: supabaseUrl is required.`). Also, strip trailing `/rest/v1/` from `VITE_SUPABASE_URL` if present.
2. **Add UI boundary for missing credentials:** Modify `src/App.tsx` to check if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided. If they are missing, display a clear error message in the UI advising the user to set up `.env` and restart the Vite development server.
3. **Run Pre-commit steps:** Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
4. **Submit changes.**
