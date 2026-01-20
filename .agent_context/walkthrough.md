# Walkthrough - Debug Loop & Stabilization

## Debug Loop Implementation
1. **GitHub Integration**: Created `services/github.ts` using `axios`.
2. **UI**: Built `app/debug.tsx` with PAT storage and issue form.
3. **Entry Point**: Added "Debug Panel" to `app/settings.tsx`.

## Environment Issues
- **Problem**: `npm start` failed because Node v12 was used, and `expo` was missing from `node_modules`.
- **Solution Paths**: Identified the need for Node 20 and a full `npm install`.
