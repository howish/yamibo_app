# Implementation Plan - Yamibo App (Feature Parity & Hybrid Auth)

## Goal
Build a React Native mobile application for Yamibo that achieves feature parity with the existing [Yamibo Mobile](https://github.com/cleoreo/yamibo-mobile) app while providing a superior native experience.

## Critical Blockers & Solutions
### 1. Authentication (`mobile:login_invalid`)
**Problem**: The direct API login fails because the server likely requires an interactive security check (CAPTCHA or Security Question) which the mobile API doesn't expose standard fields for.
**Reference App Solution**: The reference app uses a WebView, so users log in via the standard web form, which handles these checks natively.
**Proposed Solution: Hybrid Web Login**
1. Open a `WebView` (or `WebBrowser`) to the Yamibo login page.
2. User authenticates interactively (solving CAPTCHA/Questions).
3. App intercepts the `auth` cookie (or successful redirect).
4. App extracts the token and uses it for subsequent native API calls.

## Reference App Feature Parity (Roadmap)
The reference app provides the following enhancements via JavaScript injection. we will port these to Native modules:

### A. Core Experience (High Priority)
- [x] **Dark Mode / Night Theme**: Native implementation using `useColorScheme` / Context.
- [x] **Image Gallery**: Replace WebView image clicks with a native full-screen viewer (`react-native-image-viewing`) supporting Zoom and Download.
  - *Reference logic*: `main.js` uses PhotoSwipe and HTTPS replacement.
- [ ] **Traditional/Simplified Conversion**: Client-side text conversion option effectively used in the reference app.
- [x] **Font Size Settings**: Dynamic text sizing (S/M/L).

### B. Forum Enhancements (Medium Priority)
- [ ] **Batch Reply**: Ability to multi-select posts in a thread and reply to all (quoting them).
  - *Reference logic*: `desktop.js` injects checkboxes and aggregates content.
- [ ] **Reverse Floor/Post Order**: Option to change post sorting.
- [ ] **Search**: Native search interface integrating with `search.php`.

### C. UI Polish
- [ ] **Pull-to-Refresh**: Native `RefreshControl` (already standard in FlatList).
- [ ] **Jump to Top/Bottom**: Floating Action Buttons (FAB).
- [ ] **Custom Logo/Branding**: Use high-res assets.

## Proposed Changes

### 1. Authentication Refactor (Hybrid)
#### [MODIFY] [AuthContext.tsx](file:///C:/Users/howar/.gemini/antigravity/scratch/yamibo_app/context/AuthContext.tsx)
- Add `loginWithWeb` method.
- Handle cookie persistence from WebView.

#### [NEW] [LoginWebView.tsx](file:///C:/Users/howar/.gemini/antigravity/scratch/yamibo_app/app/login-web.tsx)
- A new screen that loads `https://bbs.yamibo.com/member.php?mod=logging&action=login`.
- Injects JS to detect successful login and extract cookies.

### 2. Feature Implementation
#### [NEW] [SettingsScreen.tsx](file:///C:/Users/howar/.gemini/antigravity/scratch/yamibo_app/app/settings.tsx)
- Theme toggle, Font size slider.

#### [MODIFY] [ThreadView.tsx](file:///C:/Users/howar/.gemini/antigravity/scratch/yamibo_app/components/ThreadView.tsx)
- Integrate Image Viewer for post images.
- Add "Batch Reply" selection mode.

## Verification
- **Auth**: successful login via WebView redirects to Home and persists session.
- **Gallery**: Clicking an image opens full screen viewer.
- **Settings**: Changing theme updates UI immediately.
