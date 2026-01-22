/**
 * Votes Collection Setup
 * Creates the Appwrite votes collection for upvotes/downvotes on questions and answers.
 * Uses explicit questionId/answerId fields for better query performance and index efficiency.
 */

import { IndexType, Permission, Role } from "node-appwrite";
import { db, votesCollection } from "../name";
import { ss_database } from "./config";
import { waitForAttribute } from "./utils";

export default async function createVotesCollection() {
  // Create the collection
  await ss_database.createCollection({
    databaseId: db,
    collectionId: votesCollection,
    name: votesCollection,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    documentSecurity: false,
    enabled: false,
  });

  console.log("Votes collection created");

  // Create attributes
  await Promise.all([
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: votesCollection,
      key: "voteType",
      size: 20,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: votesCollection,
      key: "questionId",
      size: 50,
      required: false,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: votesCollection,
      key: "answerId",
      size: 50,
      required: false,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: votesCollection,
      key: "voterId",
      size: 50,
      required: true,
    }),
  ]);

  console.log("Votes attributes created");

  // Wait for all attributes to become available
  console.log("Waiting for attributes to be ready...");
  await Promise.all([
    waitForAttribute(db, votesCollection, "voteType"),
    waitForAttribute(db, votesCollection, "questionId"),
    waitForAttribute(db, votesCollection, "answerId"),
    waitForAttribute(db, votesCollection, "voterId"),
  ]);
  console.log("All attributes are ready");

  // Create indexes
  await Promise.all([
    // Unique composite indexes to prevent duplicate votes
    ss_database.createIndex({
      databaseId: db,
      collectionId: votesCollection,
      key: "voter_question_unique",
      type: IndexType.Unique,
      attributes: ["voterId", "questionId"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: votesCollection,
      key: "voter_answer_unique",
      type: IndexType.Unique,
      attributes: ["voterId", "answerId"],
    }),
    // Regular indexes for querying and counting votes
    ss_database.createIndex({
      databaseId: db,
      collectionId: votesCollection,
      key: "questionId_index",
      type: IndexType.Key,
      attributes: ["questionId"],
      orders: ["ASC"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: votesCollection,
      key: "answerId_index",
      type: IndexType.Key,
      attributes: ["answerId"],
      orders: ["ASC"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: votesCollection,
      key: "voterId_index",
      type: IndexType.Key,
      attributes: ["voterId"],
      orders: ["ASC"],
    }),
  ]);

  console.log("Votes indexes created");
}
