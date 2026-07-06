## 2025-07-06 - Accessible Password Visiblity Toggle
**Learning:** Text inputs that rely solely on `placeholder` attributes without explicit `<label>` elements are inaccessible; adding `aria-label` provides necessary context for screen readers. Password toggles must use `type="button"` to avoid form submission and include padding in the input to prevent text overlap.
**Action:** Always include `aria-label`s on placeholder-only inputs and implement standard interactive component features (like `type="button"` and `focus-visible`) for absolute-positioned icons inside inputs.
