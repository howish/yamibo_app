# Debugging & Stabilization Walkthrough

This document summarizes the debugging session for the Yamibo app, covering environment setup issues and runtime errors.

## Issues Resolved

### 1. Node.js 18 Compatibility
**Issue:** The project failed to bundle on Node 18 due to missing modern APIs (`os.availableParallelism`, `URL.canParse`, `Array.prototype.with/toReversed/etc`).
**Fix:** Created `polyfill.js` and injected it via the `start` script in `package.json`.
```javascript
// polyfill.js
if (!URL.canParse) { /* ... */ }
// ... other polyfills
```

### 2. NativeWind & Tailwind Version Mismatch
**Issue:** The project had Tailwind CSS v4 installed, but `nativewind` only supports v3.
**Fix:** Downgraded `tailwindcss` to `^3.4.17` and adjusted `package.json`.

### 3. Missing Dependencies (`babel-preset-expo`, `react-native-worklets`)
**Issue:** Build failed with `Cannot find module` errors for Babel presets and reanimated plugins.
**Fix:**
- Installed `babel-preset-expo`.
- Installed `react-native-worklets` (peer dependency for Reanimated v4).
- Installed `react-native-reanimated` and `react-native-worklets-core`.

### 4. "Duplicate Key" Error in Thread View
**Issue:** When scrolling down a thread, the app crashed with `Encountered two children with the same key`. This was caused by a race condition in pagination (fetching the same page twice) and lack of deduplication.
**Fix:**
- **Race Condition:** Locked the `loading` state immediately upon fetch start for all pages.
- **Deduplication:** Implemented robust filtering in `setPosts` to reject posts with existing IDs.
```typescript
setPosts(prev => {
    const existingIds = new Set(prev.map(p => p.pid));
    const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.pid));
    return [...prev, ...uniqueNewPosts];
});
```

### 5. HTML Configuration Warning
**Issue:** `react-native-render-html` warned about missing support for the `<font>` tag.
**Fix:** Added `customHTMLElementModels` to `PostItem.tsx` to handle the `font` tag as textual content.

## Feature Implementation: Authentication

### Architecture
- **Service Layer (`services/auth.ts`):** Handles `login` API calls and manages session state.
- **Storage (`utils/storage.ts`):** Abstracted storage logic to support both `expo-secure-store` (Native) and `localStorage` (Web).
- **Network (`services/api.ts`):** Automatically injects the stored `auth` token into API requests via an Axios interceptor.

### UI
- **Login Screen (`app/login.tsx`):** A modal screen with Username/Password inputs.
- **Access:** Added a "Login" button to the header of the Home screen (`app/index.tsx`).

## Verification
- **Web Verification:** Configured a CORS proxy in `services/api.ts` `corsproxy.io` (web-only) and verified the fix using a browser agent.
- **Results:**
    - App loads successfully.
    - Forum list and Thread list render correctly.
    - Thread pagination works without crashing.
    - Login flow works (request sent, no crashes), verified handling of invalid credentials.

## Next Steps
- Implement **Reply** functionality (requires passing auth token, verified by Auth implementation).
- Polish the UI/UX.
