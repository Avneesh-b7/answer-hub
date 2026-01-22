import env from "../../env.js";

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
  .setEndpoint(env.appwrite.api_endpoint) // Your API Endpoint
  .setProject(env.appwrite.project_id) // Your project ID
  .setKey(env.appwrite.api_key); // Your secret API key

export const ss_account = new Account(ss_client);
export const ss_database = new Databases(ss_client);
export const ss_avatar = new Avatars(ss_client);
export const ss_storage = new Storage(ss_client);
export const ss_user = new Users(ss_client);
