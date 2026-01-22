/**
 * Shared utilities for database setup
 * Contains helper functions for waiting on asynchronous Appwrite operations
 */

import { ss_database } from "./config";

/**
 * Interface for Appwrite attribute response
 * Based on Appwrite API documentation
 */
interface AppwriteAttribute {
  key: string;
  type: string;
  status: "available" | "processing" | "deleting" | "stuck" | "failed";
  error?: string;
  required: boolean;
  array?: boolean;
  size?: number;
  xdefault?: any;
}

/**
 * Helper function to wait for an attribute to become available
 * Polls the attribute status until it's ready or times out
 * Based on Appwrite docs: attributes process asynchronously and need time to become available
 */
export async function waitForAttribute(
  databaseId: string,
  collectionId: string,
  attributeKey: string,
  maxAttempts = 30,
  delayMs = 1000,
) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const attribute = (await ss_database.getAttribute({
        databaseId,
        collectionId,
        key: attributeKey,
      })) as AppwriteAttribute;

      if (attribute.status === "available") {
        console.log(`  ✓ Attribute '${attributeKey}' is ready`);
        return true;
      } else if (attribute.status === "failed") {
        throw new Error(
          `Attribute '${attributeKey}' failed to process: ${attribute.error}`,
        );
      }
      // Status is still "processing", continue waiting
    } catch (error) {
      // Attribute might not exist yet, continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(
    `Attribute '${attributeKey}' did not become available within timeout (${maxAttempts * delayMs}ms)`,
  );
}
