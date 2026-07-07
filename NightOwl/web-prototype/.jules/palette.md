## 2024-05-15 - [ARIA Labels on Icon-only Buttons]
**Learning:** Icon-only buttons (such as those using Lucide React icons like `Send`, `Plus`, `Copy`) lack descriptive context for screen readers and can severely impair accessibility if left unlabelled. This is especially true for essential interactions like sending chat messages, adding friends, copying invite links, or creating voice rooms.
**Action:** Always add descriptive `aria-label` attributes to any icon-only interactive element. Additionally, ensure that buttons controlling critical actions (like message submission) implement clear visual and functional disabled states when input is invalid or missing, to improve both accessibility and general UX.

## 2024-06-25 - Prevent Premature Submission on Enter Key with IME
**Learning:** When using Japanese IME (Input Method Editor), pressing the 'Enter' key to finalize character conversion triggers an `onKeyDown` event with `e.key === 'Enter'`. If a text input has a simple `if (e.key === 'Enter')` check to submit the form, this will cause the form to submit prematurely before the user finishes typing.
**Action:** Always check `!e.nativeEvent.isComposing` inside `onKeyDown` event listeners for text inputs when listening for the 'Enter' key to ensure submission only occurs when the user actually intends to submit, not while composing characters.

## 2024-07-07 - Add Password Visibility Toggle for Authentication
**Learning:** Password inputs without a visibility toggle can lead to user frustration and incorrect login attempts, especially on mobile devices or when users are unsure of what they typed. This is a crucial, high-impact micro-UX enhancement for authentication flows. Adding absolute positioned toggles inside input fields requires careful padding adjustment on the input field itself to prevent overlapping text.
**Action:** Always implement a show/hide password toggle using `type="button"` with descriptive `aria-label`s, visually distinct focus states, and ensure the underlying input has sufficient padding (e.g., `pr-12`) to accommodate the toggle icon.
