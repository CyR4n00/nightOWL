## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.

## 2024-06-24 - Input State Lifting in Large List Views
**Learning:** Having text input state (like chat input) in the same component as a large mapped list (even if the list items are wrapped in `React.memo()`) causes the parent component to re-render on every keystroke. This means the array `.map()` operation and diffing of the list container runs on every single key press, which scales poorly (O(N) operations).
**Action:** Always extract text input fields and their local state into dedicated, separate child components (like `ChatInput`). Pass an `onSubmit` or `onPost` callback down, so the parent only re-renders when a message is actually submitted, isolating keystroke renders to just the input component itself.
