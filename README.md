# Answer Hub

A modern Q&A platform built with Next.js 16 and Appwrite, enabling users to ask questions, provide answers, and engage through comments and voting.

## Features

- **Authentication System** - Secure user registration and login with session management
- **Question & Answer** - Post questions and provide detailed answers
- **Comments** - Engage in discussions on questions and answers
- **Voting System** - Upvote/downvote questions and answers
- **User Profiles** - Personalized user profiles with avatars
- **Protected Routes** - Middleware-based route protection with session validation
- **Responsive Design** - Mobile-first UI with Tailwind CSS v4

## Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### Backend

- **[Appwrite](https://appwrite.io/)** - Backend-as-a-Service (BaaS)
  - Authentication
  - Database (NoSQL)
  - Storage (File uploads)
  - Server-side SDK for privileged operations

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Strict mode enabled
- **dotenv** - Environment variable management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** / **yarn** / **pnpm** / **bun**
- **Appwrite** instance (cloud or self-hosted)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd answer-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```env
# Appwrite Configuration
NEXT_PUBLIC_API_ENDPOINT=# or your self-hosted endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key  # Server-side only, never expose to client
```

> **⚠️ Security Warning**: Never commit `.env.local` to version control. The `APPWRITE_API_KEY` is for server-side operations only and should never be exposed to the client.

### 4. Database Setup

Initialize the Appwrite database, collections, and storage buckets:

```bash
npx tsx src/models/server/dbSetup.ts
```

This will create:

- **Database**: `answer-hub-db`
- **Collections**:
  - `user-collection` - User profiles
  - `questions-collection` - Questions
  - `answers-collection` - Answers
  - `comments-collection` - Comments
  - `votes-collection` - Voting records
- **Storage Buckets**:
  - `avatars` - User profile pictures

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
answer-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group (login, register)
│   │   └── test-protected/    # Example protected route
│   ├── components/
│   │   └── ui/                # Reusable UI components (Radix + Tailwind)
│   ├── middleware.ts          # Route protection & session validation
│   ├── models/
│   │   ├── client/            # Client-side Appwrite config
│   │   │   └── config.ts      # Public client (no API key)
│   │   ├── server/            # Server-side Appwrite config
│   │   │   ├── config.ts      # Privileged client (with API key)
│   │   │   ├── dbSetup.ts     # Database initialization script
│   │   │   └── *.collection.ts # Collection schemas
│   │   └── name.ts            # Database/collection name constants
│   ├── stores/
│   │   └── auth.store.ts      # Zustand auth state (with persistence)
│   └── env.ts                 # Centralized environment variables
├── .env.local                 # Environment variables (not in git)
├── CLAUDE.md                  # AI assistant project guidelines
└── package.json
```

## Authentication Flow

### Registration

1. User submits registration form → `useAuthStore.createAccount()`
2. Creates Appwrite Auth account
3. Automatically logs in user
4. Creates user profile document in `user-collection`
5. Stores session in Zustand + localStorage

### Login

1. User submits login form → `useAuthStore.login()`
2. Authenticates with Appwrite
3. Verifies user profile exists (creates if missing)
4. Stores session in Zustand + localStorage

### Middleware Protection

- **Session Validation**: Calls Appwrite `/account` endpoint directly with cookies
- **Security**: Prevents cookie tampering by verifying with Appwrite server
- **Protected Routes**: Redirects unauthenticated users to `/login?redirect=/original-path`
- **Auth Page Guards**: Prevents authenticated users from accessing login/register pages
- **Public Routes**: Home page (`/`) skips validation for performance

## Available Scripts

```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Key Technical Details

### Appwrite Integration

The project uses **two separate Appwrite client configurations**:

1. **Server-side** (`src/models/server/config.ts`)
   - Uses `node-appwrite` package
   - Requires API key for privileged operations
   - Used in: Server components, API routes, middleware
   - Exports: `ss_client`, `ss_account`, `ss_database`, `ss_avatar`, `ss_storage`, `ss_user`

2. **Client-side** (`src/models/client/config.ts`)
   - Uses `appwrite` package
   - No API key (public access)
   - Used in: Client components
   - Exports: `client`, `account`, `database`, `avatar`, `storage`, `ID`

> **⚠️ Important**: Never import server config files in client components. This will expose your API key.

### State Management

- **Zustand** with `immer` middleware for immutable state updates
- **Persist middleware** for localStorage persistence
- **Auth Store** (`src/stores/auth.store.ts`) manages user session

### Path Aliases

TypeScript configured with `@/*` alias:

```typescript
import env from "@/src/env";
```

## Database Management

### Reset Database

```bash
npx tsx src/models/server/dbSetup.ts
```

### Verify Database Setup

The `dbSetup.ts` script exports `verifyDatabaseSetup()` for testing.

### Teardown Database

The `dbSetup.ts` script exports `teardownDatabase()` for cleanup.

## Deployment

This Next.js application can be deployed to any platform that supports Node.js:

- **Vercel** (recommended for Next.js)
- **Railway**
- **DigitalOcean**
- **AWS / GCP / Azure**
- **Self-hosted** (Docker or PM2)

Ensure environment variables are set in your deployment platform.

## Notes

- **Next.js 16**: Uses the latest App Router with React Server Components
- **Tailwind CSS v4**: Latest version with improved performance
- **TypeScript**: Strict mode enabled for type safety
- **Code Guidelines**: See `CLAUDE.md` for AI-assisted development guidelines

## Troubleshooting

### "Appwrite service is not available"

- Verify `NEXT_PUBLIC_API_ENDPOINT` in `.env.local`
- Check Appwrite instance is running
- Confirm network connectivity

### "Invalid API key"

- Ensure `APPWRITE_API_KEY` is set correctly in `.env.local`
- Verify the API key has required permissions in Appwrite console

### Database setup fails

- Check Appwrite console for existing database/collections
- Ensure API key has database write permissions
- Try running `teardownDatabase()` first if resetting

---
