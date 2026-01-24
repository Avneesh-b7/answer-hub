/**
 * Database Setup Orchestrator
 * Centralizes all database initialization: creates database, collections, indexes, and storage buckets.
 * Run this once during initial setup or when resetting the database structure.
 */

import { ss_database, ss_storage } from "./config";
import {
  db,
  userCollection,
  questionsCollection,
  answersCollection,
  commentsCollection,
  votesCollection,
} from "../name";
import createUsersCollection from "./users.collection";
import createQuestionsCollection from "./questions.collections";
import createAnswersCollection from "./answers.collections";
import createCommentsCollection from "./comments.collections";
import createVotesCollection from "./votes.collections";
import createStorageBuckets from "./storage.bucket.setup";

/**
 * Helper function to check if collection exists before creating it
 */
async function ensureCollection(
  collectionId: string,
  collectionName: string,
  createFn: () => Promise<void>,
) {
  try {
    // Check if collection already exists
    await ss_database.getCollection({ databaseId: db, collectionId });
    console.log(
      `ℹ️  Collection '${collectionName}' already exists, skipping creation`,
    );
  } catch (error: any) {
    // Collection doesn't exist (404), so create it
    if (error.code === 404) {
      await createFn();
    } else {
      // Some other error occurred
      throw error;
    }
  }
}

/**
 * Main setup function - orchestrates the entire database initialization
 * Creates database, then collections and storage in dependency order
 */
export async function setupDatabase() {
  try {
    console.log("Starting database setup...\n");

    // Step 1: Create the database
    await createDatabase();

    // Step 2: Create collections in dependency order
    // Users and Questions are independent, so create them first in parallel
    await Promise.all([
      ensureCollection(userCollection, "users", createUsersCollection),
      ensureCollection(
        questionsCollection,
        "questions",
        createQuestionsCollection,
      ),
    ]);

    // Answers, Comments, and Votes depend on Questions but not on each other
    // Run them in parallel for better performance
    await Promise.all([
      ensureCollection(answersCollection, "answers", createAnswersCollection),
      ensureCollection(
        commentsCollection,
        "comments",
        createCommentsCollection,
      ),
      ensureCollection(votesCollection, "votes", createVotesCollection),
    ]);

    // Step 3: Create storage buckets (independent of collections)
    await createStorageBuckets();

    console.log("\n✅ Database setup completed successfully!");
    console.log("Summary:");
    console.log("   - Database: answer-hub-db");
    console.log("   - Collections: users, questions, answers, comments, votes");
    console.log("   - Storage bucket: avatars");
  } catch (error) {
    console.error("\n❌ Database setup failed:", error);
    throw error;
  }
}

/**
 * Creates the main database
 * Checks if database exists first before attempting to create
 */
async function createDatabase() {
  try {
    // Check if database already exists
    const existingDb = await ss_database.get(db);
    console.log("✅ Database already exists:", existingDb.name);
  } catch (error: any) {
    // Database doesn't exist (404), so create it
    if (error.code === 404) {
      try {
        await ss_database.create({
          databaseId: db,
          name: db,
        });
        console.log("✅ Database created:", db);
      } catch (createError: any) {
        // Handle race condition where another process created it
        if (createError.code === 409) {
          console.log("ℹ️  Database already exists:", db);
        } else {
          throw createError;
        }
      }
    } else {
      // Some other error occurred
      throw error;
    }
  }
}

/**
 * Tears down the entire database (use with caution!)
 * Useful for development/testing when you need a clean slate
 */
export async function teardownDatabase() {
  try {
    console.log("🗑️  Starting database teardown...");

    await ss_database.delete(db);

    console.log("✅ Database deleted successfully");
  } catch (error: any) {
    if (error.code === 404) {
      console.log("ℹ️  Database doesn't exist, nothing to tear down");
    } else {
      console.error("❌ Teardown failed:", error);
      throw error;
    }
  }
}

/**
 * Health check - verifies database and collections exist
 * Useful for confirming setup was successful
 */
export async function verifyDatabaseSetup() {
  try {
    console.log("🔍 Verifying database setup...");

    const database = await ss_database.get(db);
    console.log("✅ Database exists:", database.name);

    // Could add collection existence checks here if needed

    return true;
  } catch (error) {
    console.error("❌ Database verification failed:", error);
    return false;
  }
}

// If running this file directly (e.g., node dbSetup.ts)
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
