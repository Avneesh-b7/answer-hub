import env from "@/src/env";
import { Client, Account, Avatars, Storage, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint(env.appwrite.api_endpoint)
  .setProject(env.appwrite.project_id); // Replace with your project ID

export const account = new Account(client);
export const database = new Databases(client);
export const avatar = new Avatars(client);
export const storage = new Storage(client);

export { ID } from "appwrite";
