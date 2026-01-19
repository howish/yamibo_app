# Yamibo App Development Task List

- [x] **Research & API Verification**
    - [x] Verify `api/mobile/index.php` accessibility
    - [x] Document key API endpoints (Login, Forum Index, Thread List, Post List)
    - [x] Create API client service

- [x] **Authentication (Hybrid Approach)** <!-- id: 5 -->
    - [x] Create `LoginWebView` screen to handle interactive login
    - [x] Extract cookies/auth token from WebView
    - [x] Update `AuthContext` to support cookie-based session
    - [x] Implement Incognito Mode for reliable re-login

- [x] **Feature Parity: Core Experience** <!-- id: 6 -->
    - [x] Implement Dark Mode (Settings & Context)
    - [x] Implement Image Gallery (Zoom/Download) in Threads
    - [x] Implement Font Size Control

- [ ] **Feature Parity: Advanced** <!-- id: 7 -->
    - [ ] Implement Batch Reply (Multi-quote)
    - [ ] Implement Traditional/Simplified Chinese Toggle
    - [ ] Implement Search functionality

- [ ] **Forum Browsing & Interaction**
    - [x] Forum Index Screen
    - [x] Thread List Screen
    - [x] Post View Screen
    - [ ] Reply to thread
    - [ ] Create new thread

- [x] **Debugging & Stabilization**
    - [x] Fix Node.js 18 compatibility (polyfills)
    - [x] Fix Tailwind/NativeWind version mismatch
    - [x] Fix Babel/Reanimated plugin missing (Dark Mode crash)
