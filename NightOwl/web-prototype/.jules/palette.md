## 2024-05-15 - [ARIA Labels on Icon-only Buttons]
**Learning:** Icon-only buttons (such as those using Lucide React icons like `Send`, `Plus`, `Copy`) lack descriptive context for screen readers and can severely impair accessibility if left unlabelled. This is especially true for essential interactions like sending chat messages, adding friends, copying invite links, or creating voice rooms.
**Action:** Always add descriptive `aria-label` attributes to any icon-only interactive element. Additionally, ensure that buttons controlling critical actions (like message submission) implement clear visual and functional disabled states when input is invalid or missing, to improve both accessibility and general UX.

## 2024-06-25 - Prevent Premature Submission on Enter Key with IME
**Learning:** When using Japanese IME (Input Method Editor), pressing the 'Enter' key to finalize character conversion triggers an `onKeyDown` event with `e.key === 'Enter'`. If a text input has a simple `if (e.key === 'Enter')` check to submit the form, this will cause the form to submit prematurely before the user finishes typing.
**Action:** Always check `!e.nativeEvent.isComposing` inside `onKeyDown` event listeners for text inputs when listening for the 'Enter' key to ensure submission only occurs when the user actually intends to submit, not while composing characters.

## 2024-07-18 - Password Toggle UX and Accessibility
**Learning:** Adding interactive elements (like a show/hide password toggle) inside input fields requires not only proper ARIA attributes (`aria-label`) and functional state management but also crucial CSS adjustments. If the input field lacks sufficient right padding (`pr-12`), long passwords will visually overlap with the absolute-positioned toggle icon, causing a broken UI and poor readability.
**Action:** When inserting absolute-positioned elements inside input containers, always ensure corresponding padding (e.g., `pr-[size]`) is added to the `<input>` element to reserve space for the icon. Additionally, ensure the toggle button has `type="button"` to prevent accidental form submission and implements `focus-visible` styles for keyboard navigation.
