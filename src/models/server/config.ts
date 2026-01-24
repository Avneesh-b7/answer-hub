// Server-side Appwrite configuration - uses private API key
// NEVER import this file in client components!

// Load environment variables from project root .env.local when running setup scripts (npx tsx)
// Next.js automatically loads .env files, but standalone scripts need this
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, "../../.env.local") });

import {
  Client,
  Databases,
  Account,
  Users,
  Functions,
  Avatars,
  Storage,
} from "node-appwrite";

const ss_client = new Client();

ss_client
  .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // Server-only secret

export const ss_account = new Account(ss_client);
export const ss_database = new Databases(ss_client);
export const ss_avatar = new Avatars(ss_client);
export const ss_storage = new Storage(ss_client);
export const ss_user = new Users(ss_client);
