
## 2023-10-24 - [Fix jumping UI from unmemoized Math.random]
**Learning:** Using `Math.random()` inside a render method without memoization creates new random values on every re-render, causing severe UI jumps and performance hits from inline style recalculations and forced DOM reflows.
**Action:** Always wrap randomly generated static properties (like cosmetic background bubbles) in `useMemo` so they persist across re-renders unless their explicit dependencies change.
