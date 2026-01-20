# Implementation Plan - Debug Loop & Environment Setup

## Debug Loop (Completed)
Implement a debug panel within the app that allows users to submit issues directly to the GitHub repository.

### Proposed Changes
- **GitHub Service**: `services/github.ts` for direct API calls.
- **Debug Panel**: `app/debug.tsx` for user submission.
- **Settings**: Integration in `app/settings.tsx`.

## Environment Setup (In Progress)
Fix the local development environment to support the current project version.

### Issues
- Node.js version is too old (v12).
- `node_modules` is incomplete (missing `expo`).

### Plan
1. Use `nvm install 20` to upgrade Node.
2. Run `npm install` to restore dependencies.
