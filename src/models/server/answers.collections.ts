/**
 * Answers Collection Setup
 * Creates the Appwrite answers collection with attributes (questionId, content, authorId) and indexes.
 * Run this function once during initial database setup. Uses Appwrite's auto-generated $createdAt and $updatedAt.
 */

import { IndexType, Permission, Role } from "node-appwrite";
import { answersCollection, db } from "../name";
import { ss_database } from "./config";

export default async function createAnswersCollection() {
  // Create the collection
  await ss_database.createCollection({
    databaseId: db,
    collectionId: answersCollection,
    name: answersCollection,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    documentSecurity: false,
    enabled: false,
  });

  console.log("Answers collection created");

  // Create attributes
  await Promise.all([
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: answersCollection,
      key: "questionId",
      size: 50,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: answersCollection,
      key: "content",
      size: 10000,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: answersCollection,
      key: "authorId",
      size: 50,
      required: true,
    }),
  ]);

  console.log("Answers attributes created");

  // Create indexes
  await Promise.all([
    ss_database.createIndex({
      databaseId: db,
      collectionId: answersCollection,
      key: "questionId_index",
      type: IndexType.Key,
      attributes: ["questionId"],
      orders: ["ASC"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: answersCollection,
      key: "authorId_index",
      type: IndexType.Key,
      attributes: ["authorId"],
      orders: ["ASC"],
    }),
  ]);

  console.log("Answers indexes created");
}
