import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const boardMembers = pgTable("board_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").references(() => boards.id),
  userId: text("user_id").notNull(),
});

export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  boardId: uuid("board_id").references(() => boards.id),
  position: integer("position").notNull(),
});

export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  listId: uuid("list_id").references(() => lists.id),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});
