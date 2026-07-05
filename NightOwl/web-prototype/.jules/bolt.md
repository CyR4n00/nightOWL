## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-07-05 - Optimize realtime subscriptions to prevent O(N) refetches
**Learning:** By default, realtime subscriptions often refetch an entire list of items (e.g. 50 messages) on every `INSERT` event to refresh the UI. This causes O(N) network payload sizes and backend load per new item.
**Action:** Optimize realtime subscriptions by handling `INSERT` events specifically. Use `payload.new` to construct the new item locally and prepend/append it to the state in O(1) time, entirely bypassing the network fetch. Maintain a fallback refetch for `UPDATE` and `DELETE` events for data consistency.
