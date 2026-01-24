// Client-side Appwrite configuration - ONLY uses NEXT_PUBLIC_ variables
// These variables are safe to expose to the browser
// CRITICAL: Do NOT import env.ts here - it contains server-only secrets!
import { Client, Account, Avatars, Storage, Databases } from "appwrite";

export const client = new Client();

// Use process.env directly - Next.js will replace these at build time
client
  .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const database = new Databases(client);
export const avatar = new Avatars(client);
export const storage = new Storage(client);

export { ID } from "appwrite";
