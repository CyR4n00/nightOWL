## 2024-06-17 - Missing ARIA Labels on Icon Buttons
**Learning:** There is a pattern of missing `aria-label`s on icon-only buttons in this application (e.g., Send, Plus, and Copy buttons across various views). This makes the interface inaccessible to screen reader users who rely on text alternatives to understand the button's purpose.
**Action:** When adding or reviewing new icon-only interactive elements, ensure they have descriptive `aria-label` attributes to provide necessary context for assistive technologies.
