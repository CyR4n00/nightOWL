
## 2024-05-23 - Code-split large view components to optimize initial bundle size
**Learning:** Initial bundle size can be severely bloated when heavy dependencies like the Agora SDK (used in `VoiceRoomView`) are imported synchronously in the main entry point (`App.tsx`), blocking fast initial rendering.
**Action:** Use `React.lazy()` and `React.Suspense` to conditionally load massive feature views (`VoiceRoomView`, `FriendChatView`, etc.) instead of statically importing them, significantly shrinking the critical path payload.
