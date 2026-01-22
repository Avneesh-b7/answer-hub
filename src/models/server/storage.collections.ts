/**
 * Storage Buckets Setup
 * Creates Appwrite storage bucket for user avatars.
 * Run this function once during initial setup to create the storage bucket with proper permissions.
 */

import { Permission, Role, Compression } from "node-appwrite";
import { ss_storage } from "./config";

/**
 * Helper function to check if a bucket exists before creating it
 */
async function ensureBucket(
  bucketId: string,
  bucketName: string,
  createFn: () => Promise<void>,
) {
  try {
    // Check if bucket already exists
    await ss_storage.getBucket({ bucketId });
    console.log(`ℹ️  Bucket '${bucketName}' already exists, skipping creation`);
  } catch (error: any) {
    // Bucket doesn't exist (404), so create it
    if (error.code === 404) {
      await createFn();
      console.log(`✅ Bucket '${bucketName}' created`);
    } else {
      // Some other error occurred
      throw error;
    }
  }
}

export default async function createStorageBuckets() {
  // Create bucket for user avatars
  await ensureBucket("avatars", "User Avatars", async () => {
    await ss_storage.createBucket({
      bucketId: "avatars",
      name: "User Avatars",
      permissions: [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      fileSecurity: true,
      enabled: true,
      maximumFileSize: 2097152, // 2MB
      allowedFileExtensions: ["jpg", "jpeg", "png", "gif"],
      compression: Compression.Gzip,
      encryption: true,
      antivirus: true,
    });
  });
}
