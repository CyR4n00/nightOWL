## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-07-10 - Code-splitting heavy route dependencies
**Learning:** Found that statically importing heavy dependencies like WebRTC/Agora SDKs in root route components causes massive initial bundle sizes (e.g., >1.5MB for VoiceRoomView), blocking the initial load for users who haven't even navigated to those features yet.
**Action:** Always use `React.lazy()` and `<React.Suspense>` to dynamically code-split large route components or views that contain heavy third-party SDKs to significantly reduce the main JavaScript bundle size and improve app load time.
