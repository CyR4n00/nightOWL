## 2024-07-11 - Dynamic Imports Prevent Render Blocking
**Learning:** In Single Page Applications (SPAs) with large dependencies bound to specific route views (like Agora SDK within `VoiceRoomView`), importing those views statically severely inflates the initial bundle size, impacting TTI.
**Action:** Always implement code-splitting using `React.lazy()` and `Suspense` for top-level route components to defer loading heavy assets until they are actually navigated to.
