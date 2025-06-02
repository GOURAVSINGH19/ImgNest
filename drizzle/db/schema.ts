import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(), 
  size: integer("size").notNull(),
  type: text("type").notNull(), 

  //storage info
  fileUrl: text("file_url").notNull(),
  thumbnail: text("thumbnail_url"),

  // ownership
  userId: uuid("user_id").notNull().references(() => users.id),
  parentId: uuid("parent_id"), // parent folder id ( null for root items)

  // file /folder flags
  isFolder: boolean("is_Folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_Trash").default(false).notNull(),

  //Timespan
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  files: many(files),
}));

export const filerealtions = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
  //relationship to child file/folder
  Children: many(files),
  //relationship to user
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
