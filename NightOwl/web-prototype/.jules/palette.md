## 2025-02-24 - Password Visibility Toggle Enhancement
**Learning:** Adding interactive, absolute-positioned accessibility elements (like toggle buttons) inside form inputs requires careful `padding-right` adjustments to prevent user text from overlapping the toggle icon.
**Action:** When adding absolute positioned icons inside text inputs, immediately map their physical width and padding to the parent input's right-padding utility class (e.g., matching a `w-5` icon with `pr-12`).
