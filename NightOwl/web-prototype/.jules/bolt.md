## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-05-20 - Lazy Loading and Main Bundle Size Reduction
**Learning:** In a single page application like NightOwl, bundling all view components (especially those like VoiceRoomView that pull in heavy third-party SDKs like Agora) into the main `index.js` dramatically degrades initial load time. Vite throws a warning for chunks > 500kB which reveals the lack of code splitting.
**Action:** Use `React.lazy()` with dynamic imports and wrap the routing logic in a `React.Suspense` boundary. This defers the download of heavy views until the user actually navigates to that tab, keeping the main entry point extremely lightweight.
