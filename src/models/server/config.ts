import env from "@/src/env";

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

export const ss_account = new Account(ss_client);
export const ss_database = new Databases(ss_client);
export const ss_avatar = new Avatars(ss_client);
export const ss_storage = new Storage(ss_client);
export const ss_user = new Users(ss_client);

ss_client
  .setEndpoint(env.appwrite.api_endpoint) // Your API Endpoint
  .setProject(env.appwrite.project_id) // Your project ID
  .setKey(env.appwrite.api_key); // Your secret API key
//   .setSelfSigned(); // Use only on dev mode with a self-signed SSL cert
