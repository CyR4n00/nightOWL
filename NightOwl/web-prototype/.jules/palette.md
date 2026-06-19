## 2026-06-19 - [Adding ARIA Labels to Icon-only Buttons]
**Learning:** For this app's UI elements (like buttons) that rely solely on icons to convey their meaning (e.g., using `Send`, `Plus`, `Copy` from `lucide-react`), relying visually on the icons is insufficient for accessibility. Adding descriptive `aria-label`s on icon-only interactive elements is a crucial pattern for screen reader support in this design system.
**Action:** When creating or modifying icon-only buttons, always explicitly add `aria-label`s describing the action.
