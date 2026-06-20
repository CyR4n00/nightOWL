## 2024-05-18 - [Prevent Unbounded List Rendering]
**Learning:** Avoid coupling text input state with large unmemoized list renderings. Typing in an input field tied to the same component state as a large list causes the entire list to re-render on every keystroke, resulting in O(n) cascading re-renders and poor performance.
**Action:** Extract list items into separate components and wrap them with `React.memo()`.

## 2024-05-18 - [Prevent Unbounded Supabase Queries]
**Learning:** Supabase queries fetching lists without a limit can cause unbounded data fetching, which degrades both client and database performance, especially when connected to real-time subscriptions that refetch on every update.
**Action:** Always apply a `.limit()` clause (e.g., `.limit(50)`) to Supabase list queries (like posts or messages).