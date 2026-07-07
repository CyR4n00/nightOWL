## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2025-02-12 - Code-Split Heavy Third-Party Route Dependencies
**Learning:** Large real-time communication libraries (like the Agora RTC SDK) can severely block the initial render of SPA entry points (like `App.tsx`) when statically imported alongside core views.
**Action:** Always wrap heavy route components utilizing large third-party RTC or WebRTC SDKs in a dynamic `React.lazy` import and `React.Suspense` boundary, especially in tabbed layouts, to prevent fetching the heavy dependency until the specific view is actively requested.
