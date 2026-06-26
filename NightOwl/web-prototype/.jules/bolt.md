## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.

## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.

## 2024-10-27 - Optimize Supabase Realtime Subscriptions with Local State Updates
**Learning:** Found that `postgres_changes` realtime subscriptions were triggering a full O(N) network refetch of the entire list (e.g., 50 chat messages) for every single `INSERT` event. Furthermore, without strict server-side payload filtering, the client was blindly fetching data even when unrelated users interacted.
**Action:** Instead of calling the full fetch function inside `.on('postgres_changes')`, directly map `payload.new` to the local state format and append it using state setter callbacks. Apply local conditional filtering to ensure the payload actually belongs to the active view before updating.
