## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-07-30 - Code-splitting Large Components with React.lazy
**Learning:** Found that the main application bundle was inflated (over 500kb gzip) because heavy components and their dependencies (like the Agora SDK in VoiceRoomView) were imported synchronously in App.tsx. This delays the initial render of the app even if the user never navigates to the Voice Room.
**Action:** Always use `React.lazy()` and `React.Suspense` to code-split large route components, especially those with heavy external SDKs, to defer their loading until they are actually rendered, significantly reducing the main JavaScript bundle size.
