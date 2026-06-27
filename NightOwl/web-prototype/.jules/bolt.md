## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.

## 2026-06-27 - O(1) Local State Updates for Realtime Subscriptions
**Learning:** Found that real-time list views (posts, direct messages) were refetching the entire list using O(N) queries on every database INSERT. This can cause severe performance and network degradation over time, especially in active chat scenarios.
**Action:** When subscribing to Supabase `postgres_changes`, extract `payload.new` to fetch or directly construct the new item, and update the local list state in O(1) time by prepending or appending the new object (and limiting the array length if necessary).
