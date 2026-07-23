## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-06-26 - O(1) Local State Updates in Realtime Subscriptions
**Learning:** Performing a full re-fetch of data (e.g., calling `fetchPosts()`) inside a Supabase `postgres_changes` listener causes unnecessary O(N) database queries and network overhead on every single real-time event.
**Action:** Utilize the real-time event payload (`payload.new` for INSERT/UPDATE) to perform O(1) targeted local state updates (e.g., appending the new record directly to the React state array), only querying the database for the specific individual record if relational data is required.
