# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Answer Hub is a Q&A platform built with Next.js 16 and Appwrite as the backend-as-a-service. The application follows a typical Next.js App Router structure with server and client-side Appwrite integrations.

## general guidelines

on every file i want a 2-3 liner explainer /usage guidelines in the form of comments.

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

Environment variables are centralized in `src/env.ts`. Required variables:

- `API_ENDPOINT` - Appwrite API endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Appwrite project ID
- `APPWRITE_API_KEY` - Appwrite API key (server-side only)

### Data Models

Database and collection names are defined in `src/models/name.ts`:

- Database: `answer-hub-db`
- Collections: `questions-collection`, `answers-collection`, `comments-collection`, `votes-collection`

Collection setup files are in `src/models/server/`:

- `questions.collections.ts`
- `answers.collections.ts`
- `comments.collections.ts`
- `votes.collections.ts`
- `storage.collections.ts`
- `seeding.ts`

### Path Aliases

TypeScript is configured with `@/*` alias pointing to the project root, allowing imports like:

```typescript
import env from "@/src/env";
```

## Key Technical Details

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **TypeScript**: Strict mode enabled
- **Backend**: Appwrite (collections for questions, answers, comments, votes)
- **React**: Version 19.2.3 with JSX transform set to `react-jsx`
