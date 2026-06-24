## 2024-05-15 - [ARIA Labels on Icon-only Buttons]
**Learning:** Icon-only buttons (such as those using Lucide React icons like `Send`, `Plus`, `Copy`) lack descriptive context for screen readers and can severely impair accessibility if left unlabelled. This is especially true for essential interactions like sending chat messages, adding friends, copying invite links, or creating voice rooms.
**Action:** Always add descriptive `aria-label` attributes to any icon-only interactive element. Additionally, ensure that buttons controlling critical actions (like message submission) implement clear visual and functional disabled states when input is invalid or missing, to improve both accessibility and general UX.
## 2024-06-24 - Chat Input UX & A11y
**Learning:** Adding 'Enter' key submission to inputs in a Japanese app requires checking `!e.nativeEvent.isComposing` to avoid accidental submission during IME kanji conversion. Inputs also need `aria-label` attributes for screen reader accessibility.
**Action:** Always include the IME composition check on `onKeyDown` handlers and ensure inputs have descriptive `aria-label`s.
