## 2024-10-24 - Add ARIA Labels to Icon-only Buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons improves accessibility for screen reader users by providing context to otherwise purely visual interactive elements. Since the application is primarily in Japanese, utilizing appropriate Japanese terminology for `aria-label` is crucial.
**Action:** Always verify if a button containing only an icon (e.g., `Send` icon for post, `Plus` icon for adding friends/rooms) has text adjacent to it. If not, include an `aria-label` with descriptive text.
