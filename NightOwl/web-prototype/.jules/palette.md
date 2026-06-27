## 2024-05-15 - [ARIA Labels on Icon-only Buttons]
**Learning:** Icon-only buttons (such as those using Lucide React icons like `Send`, `Plus`, `Copy`) lack descriptive context for screen readers and can severely impair accessibility if left unlabelled. This is especially true for essential interactions like sending chat messages, adding friends, copying invite links, or creating voice rooms.
**Action:** Always add descriptive `aria-label` attributes to any icon-only interactive element. Additionally, ensure that buttons controlling critical actions (like message submission) implement clear visual and functional disabled states when input is invalid or missing, to improve both accessibility and general UX.

## 2024-06-25 - Prevent Premature Submission on Enter Key with IME
**Learning:** When using Japanese IME (Input Method Editor), pressing the 'Enter' key to finalize character conversion triggers an `onKeyDown` event with `e.key === 'Enter'`. If a text input has a simple `if (e.key === 'Enter')` check to submit the form, this will cause the form to submit prematurely before the user finishes typing.
**Action:** Always check `!e.nativeEvent.isComposing` inside `onKeyDown` event listeners for text inputs when listening for the 'Enter' key to ensure submission only occurs when the user actually intends to submit, not while composing characters.
## 2025-02-13 - [Add Password Visibility Toggle]
**Learning:** Password visibility toggles are highly effective micro-UX improvements. Adding `aria-label` to dynamically changing icons (e.g. `Eye`/`EyeOff` from `lucide-react`) significantly boosts accessibility. Ensure the toggle button uses `type="button"` to avoid accidentally triggering form submission.
**Action:** Always include a show/hide password option on password fields in authentication views using a well-styled and screen-reader accessible toggle button.
