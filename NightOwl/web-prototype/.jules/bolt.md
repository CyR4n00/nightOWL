## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-07-01 - Prevent O(N) re-fetches on realtime INSERT events
**Learning:** React components (e.g., `PrivateChatView`) subscribing to Supabase `postgres_changes` were triggering a full `fetchMessages` call (an O(N) database query) on every new message (`INSERT` event). This causes unnecessary database load and O(N) network transfer per single new message.
**Action:** Instead of re-fetching the entire list, use the `payload.new` object provided by the subscription event to perform an O(1) local state update, appending the new message directly to the existing state array. Ensure duplicate checks exist if necessary.
