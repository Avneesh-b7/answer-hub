/**
 * Comments Collection Setup
 * Creates the Appwrite comments collection with attributes for commenting on questions or answers.
 * Comments have either questionId (for question comments) or answerId (for answer comments) set.
 */

import { IndexType, Permission, Role } from "node-appwrite";
import { commentsCollection, db } from "../name";
import { ss_database } from "./config";

export default async function createCommentsCollection() {
  // Create the collection
  await ss_database.createCollection({
    databaseId: db,
    collectionId: commentsCollection,
    name: commentsCollection,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    documentSecurity: false,
    enabled: false,
  });

  console.log("Comments collection created");

  // Create attributes
  await Promise.all([
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: commentsCollection,
      key: "content",
      size: 10000,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: commentsCollection,
      key: "questionId",
      size: 50,
      required: false,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: commentsCollection,
      key: "answerId",
      size: 50,
      required: false,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: commentsCollection,
      key: "authorId",
      size: 50,
      required: true,
    }),
  ]);

  console.log("Comments attributes created");

  // Create indexes
  await Promise.all([
    ss_database.createIndex({
      databaseId: db,
      collectionId: commentsCollection,
      key: "questionId_index",
      type: IndexType.Key,
      attributes: ["questionId"],
      orders: ["ASC"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: commentsCollection,
      key: "answerId_index",
      type: IndexType.Key,
      attributes: ["answerId"],
      orders: ["ASC"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: commentsCollection,
      key: "authorId_index",
      type: IndexType.Key,
      attributes: ["authorId"],
      orders: ["ASC"],
    }),
  ]);

  console.log("Comments indexes created");
}
