## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.

## 2024-07-12 - Supabase postgres_changes Channel Filtering
**Learning:** `supabase.channel('dm:id1:id2')` channel names are purely for client-side multiplexing and DO NOT automatically filter `postgres_changes` events by the database rows related to those IDs. Listening to `postgres_changes` on a high-traffic table (like `direct_messages`) without row-level client-side filtering causes O(N) refetches across ALL active clients whenever *any* message is sent system-wide.
**Action:** When optimizing `postgres_changes` to prevent O(N) refetches by directly appending `payload.new` to local state, ALWAYS verify if the event payload actually belongs to the current context/user via client-side conditional checks before updating the state.
