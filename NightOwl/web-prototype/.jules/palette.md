## 2024-07-24 - Input Padding Overlaps
**Learning:** Adding absolutely positioned icons (like eye/eye-off) inside input containers can cause text to overlap the icon if the user types a long string.
**Action:** Always verify and increase the `padding-right` (e.g., `pr-12` in Tailwind) of the base input when floating an element over its right edge.
