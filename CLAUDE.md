# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Answer Hub is a Q&A platform built with Next.js 16 and Appwrite as the backend-as-a-service. The application follows a typical Next.js App Router structure with server and client-side Appwrite integrations.

## General Guidelines

On every file, add a 2-3 line explainer/usage guidelines in the form of comments at the top.

## Common Commands

```bash
# Development
npm run dev          # Start development server at http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Appwrite Integration

The project uses two separate Appwrite client configurations:

1. **Server-side client** (`src/models/server/config.ts`)
   - Uses `node-appwrite` package
   - Requires API key for privileged operations
   - Exports: `ss_client`, `ss_account`, `ss_database`, `ss_avatar`, `ss_storage`, `ss_user`
   - Used for server components and API routes

2. **Client-side client** (`src/models/client/config.ts`)
   - Uses `appwrite` package
   - No API key required (public access)
   - Exports: `client`, `account`, `database`, `avatar`, `storage`, `ID`
   - Used for client components

### Environment Configuration

Environment variables are centralized in `src/env.ts`. Create a `.env.local` file with:

- `NEXT_PUBLIC_API_ENDPOINT` - Appwrite API endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Appwrite project ID
- `APPWRITE_API_KEY` - Appwrite API key (server-side only, never expose to client)

**CRITICAL**: The server config (`src/models/server/config.ts`) loads `.env.local` using `dotenv` for standalone scripts. Never import `env.ts` or server config files in client components.

### Data Models

Database and collection names are defined in `src/models/name.ts`:

- Database: `answer-hub-db`
- Collections: `user-collection`, `questions-collection`, `answers-collection`, `comments-collection`, `votes-collection`

Collection setup files are in `src/models/server/`:

- `users.collection.ts`
- `questions.collections.ts`
- `answers.collections.ts`
- `comments.collections.ts`
- `votes.collections.ts`
- `storage.bucket.setup.ts`

### Database Setup

To initialize or reset the database structure, use the centralized setup script:

```bash
npx tsx src/models/server/dbSetup.ts
```

This orchestrates:
- Database creation
- All collection creation with proper indexes
- Storage bucket setup (avatars)

The `dbSetup.ts` file also exports `teardownDatabase()` and `verifyDatabaseSetup()` functions for development/testing.

### Path Aliases

TypeScript is configured with `@/*` alias pointing to the project root, allowing imports like:

```typescript
import env from "@/src/env";
```

### State Management

The application uses Zustand for state management with persistence:

- **Auth Store** (`src/stores/auth.store.ts`): Manages user authentication state
  - Uses Zustand with `immer` middleware for immutable updates
  - Persists user/session to localStorage
  - Registration flow: Creates Auth user → Auto-login → Creates user profile document in database
  - Login flow: Authenticates → Verifies profile exists (creates if missing as fallback)
  - Exports: `useAuthStore` hook and `IAuthResponse` type

### App Structure

- **App Router**: Uses Next.js 16 App Router with route groups
  - `(auth)/` - Auth-related pages (login, register) with dedicated layout
  - Root pages at `src/app/`
- **UI Components**: Located in `src/components/ui/` (Radix UI primitives with Tailwind)

### Middleware

Route protection is handled by `src/middleware.ts`:

- **Session validation**: Validates sessions by calling Appwrite's `/account` endpoint directly
- **Security**: Prevents cookie tampering by verifying with Appwrite server (not just checking cookie presence)
- **Auth page redirects**: Prevents authenticated users from accessing login/register pages
- **Protected route guards**: Redirects unauthenticated users to login with return URL (`?redirect=`)
- **Public routes**: Home page (`/`) skips validation for performance
- **Direct API calls**: Uses `fetch` to call Appwrite directly (no intermediate API route needed)

**Authentication Flow:**
1. User requests protected route → Middleware calls Appwrite `/account` with cookies
2. Appwrite validates session (checks database, expiration, tampering)
3. Valid session → Allow access | Invalid session → Redirect to `/login?redirect=/original-path`

## Key Technical Details

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **TypeScript**: Strict mode enabled, JSX transform set to `react-jsx`
- **Backend**: Appwrite (collections for users, questions, answers, comments, votes)
- **React**: Version 19.2.3
- **State Management**: Zustand with immer and persist middleware
- **UI Library**: Radix UI + Tailwind + lucide-react icons
