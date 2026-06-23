## 2024-06-23 - Unbounded Supabase Queries in Realtime Views
**Learning:** Found that list queries (posts, messages, voice rooms) were fetching the entire table on load without pagination. This is dangerous in views with real-time subscriptions that refetch the list on every insert, causing O(n) data transfer and memory growth over time.
**Action:** Always append `.limit(50)` (or an appropriate limit) to list-fetching Supabase queries to cap payload size and prevent performance degradation.

## 2026-06-22 - [Optimize Feed Rendering and Prevent Unbounded Fetching]
**Learning:** Found a critical performance bottleneck in `HomeView.tsx` where a large list of posts was rendered without `React.memo()`, and state for a text input (`inputText`) was kept in the same component. This caused O(n) cascading re-renders of the entire feed on every keystroke. Additionally, unbounded fetching from Supabase (`fetchPosts` without `.limit()`) exacerbates the issue as the dataset grows over time.
**Action:** Always wrap large list items in `React.memo()` and explicitly set a `.limit(n)` on Supabase queries that return lists to prevent unbounded data fetching.
