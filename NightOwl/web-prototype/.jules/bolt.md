## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2026-07-15 - Code Split Main Views
**Learning:** Initial bundle sizes can grow rapidly in Single Page Applications like Vite+React when all main views (Home, Chat, Voice, Profile) are statically imported in the root App component, forcing users to download code for views they haven't visited yet.
**Action:** Use `React.lazy` combined with `React.Suspense` for all top-level route views to ensure Vite's bundler automatically code-splits them into separate JS chunks, significantly speeding up initial Time to Interactive.
