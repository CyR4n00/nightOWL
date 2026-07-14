## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.
## 2024-06-25 - Prevent O(N) re-renders on keystrokes in list components
**Learning:** In React, coupling high-frequency text input state (like chat input) with unmemoized `.map()` list renderings causes severe UI thrashing, as the entire list of N elements is re-created on every keystroke. Wrapping child elements in `React.memo` is insufficient because the parent still re-computes the array map and performs N prop comparisons.
**Action:** Always wrap `.map()` list generation inside a `useMemo` hook, caching the generated JSX array against the raw data array dependency, ensuring O(1) list reconciliation during input typing.
## 2024-06-25 - Fetch single record on realtime insert when relational data is needed
**Learning:** Using `payload.new` for O(1) local state updates in Supabase realtime subscriptions works well, but if the original O(N) fetch was selecting joined relational data (e.g., `*, users!user_id ( username )`), simply appending `payload.new` will result in missing relational fields in the UI.
**Action:** When a realtime `INSERT` occurs and the UI depends on joined relational data, do a targeted query to fetch the single new record along with its relations (`.eq('id', payload.new.id).single()`) before prepending it to the local state.
