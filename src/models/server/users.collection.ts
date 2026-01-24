/**
 * Users Collection Setup
 * Creates the Appwrite users collection with attributes for extended user profile data.
 * Stores reputation, avatar, bio, and activity stats linked to Appwrite Auth users.
 */

import { IndexType, Permission, Role } from "node-appwrite";
import { db, userCollection } from "../name";
import { ss_database } from "./config";
import { waitForAttribute } from "./utils";

export default async function createUsersCollection() {
  // Create the collection
  await ss_database.createCollection({
    databaseId: db,
    collectionId: userCollection,
    name: userCollection,
    permissions: [
      Permission.read(Role.any()), // Anyone can read user profiles
      Permission.create(Role.users()), // Only authenticated users can create
      Permission.update(Role.users()), // Only authenticated users can update
      Permission.delete(Role.users()), // Only authenticated users can delete
    ],
    documentSecurity: true, // Enable document-level permissions for privacy
    enabled: true,
  });

  console.log("Users collection created");

  // Create attributes
  await Promise.all([
    // Link to Appwrite Auth user ID
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: userCollection,
      key: "userId",
      size: 50,
      required: true,
    }),
    // Avatar file ID from Appwrite Storage
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: userCollection,
      key: "avatarId",
      size: 50,
      required: false,
    }),
    // User reputation score (starts at 0)
    ss_database.createIntegerAttribute({
      databaseId: db,
      collectionId: userCollection,
      key: "reputation",
      required: true,
      min: 0,
      max: 1000000,
    }),
    // User bio/description
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: userCollection,
      key: "bio",
      size: 500,
      required: false,
    }),
    // Count of questions asked by user
    ss_database.createIntegerAttribute({
      databaseId: db,
      collectionId: userCollection,
      key: "questionsAsked",
      required: true,
      min: 0,
      max: 100000,
    }),
    // Count of answers given by user
    ss_database.createIntegerAttribute({
      databaseId: db,
      collectionId: userCollection,
      key: "answersGiven",
      required: true,
      min: 0,
      max: 100000,
    }),
  ]);

  console.log("Users attributes created");

  // Wait for all attributes to become available
  console.log("Waiting for attributes to be ready...");
  await Promise.all([
    waitForAttribute(db, userCollection, "userId"),
    waitForAttribute(db, userCollection, "avatarId"),
    waitForAttribute(db, userCollection, "reputation"),
    waitForAttribute(db, userCollection, "bio"),
    waitForAttribute(db, userCollection, "questionsAsked"),
    waitForAttribute(db, userCollection, "answersGiven"),
  ]);
  console.log("All attributes are ready");

  // Create indexes for efficient queries
  await Promise.all([
    // Index on userId for quick lookups
    ss_database.createIndex({
      databaseId: db,
      collectionId: userCollection,
      key: "userId_index",
      type: IndexType.Unique, // Each userId should be unique
      attributes: ["userId"],
    }),
    // Index on reputation for leaderboards and filtering
    ss_database.createIndex({
      databaseId: db,
      collectionId: userCollection,
      key: "reputation_index",
      type: IndexType.Key,
      attributes: ["reputation"],
      orders: ["DESC"], // For descending order (highest first)
    }),
  ]);

  console.log("Users indexes created");
  console.log("✅ Users collection setup complete!");
}
