/**
 * Questions Collection Setup
 * Creates the Appwrite questions collection with attributes (title, content, authorId, tags) and indexes.
 * Run this function once during initial database setup to create the collection structure.
 */

import { IndexType, Permission, Role } from "node-appwrite";
import { db, questionsCollection } from "../name";
import { ss_database } from "./config";

export default async function createQuestionsCollection() {
  // Create the collection
  await ss_database.createCollection({
    databaseId: db,
    collectionId: questionsCollection,
    name: questionsCollection,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    documentSecurity: false, // optional
    enabled: false, // optional
  });

  console.log("Questions collection created");

  // Create attributes
  await Promise.all([
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: questionsCollection,
      key: "title",
      size: 255,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: questionsCollection,
      key: "content",
      size: 10000,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: questionsCollection,
      key: "authorId",
      size: 50,
      required: true,
    }),
    ss_database.createStringAttribute({
      databaseId: db,
      collectionId: questionsCollection,
      key: "tags",
      size: 50,
      required: false,
      array: true,
    }),
  ]);

  console.log("Questions attributes created");

  // Create indexes
  await Promise.all([
    ss_database.createIndex({
      databaseId: db,
      collectionId: questionsCollection,
      key: "authorId_index",
      type: IndexType.Key,
      attributes: ["authorId"],
      orders: ["ASC"],
    }),
    ss_database.createIndex({
      databaseId: db,
      collectionId: questionsCollection,
      key: "title_index",
      type: IndexType.Fulltext,
      attributes: ["title"],
    }),
  ]);

  console.log("Questions indexes created");
}
