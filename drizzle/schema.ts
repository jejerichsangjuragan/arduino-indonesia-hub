import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const communityProjects = mysqlTable("community_projects", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  level: mysqlEnum("level", ["Pemula", "Menengah", "Mahir"]).default("Pemula").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  moderatorNote: text("moderatorNote"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  moderatedAt: timestamp("moderatedAt"),
  moderatedBy: int("moderatedBy"),
});

export type CommunityProject = typeof communityProjects.$inferSelect;
export type InsertCommunityProject = typeof communityProjects.$inferInsert;

export const storedFiles = mysqlTable("stored_files", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  projectId: int("projectId"),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull().unique(),
  url: varchar("url", { length: 768 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  context: mysqlEnum("context", ["tutorial", "project", "schematic", "sketch", "build-log"]).default("build-log").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoredFile = typeof storedFiles.$inferSelect;
export type InsertStoredFile = typeof storedFiles.$inferInsert;