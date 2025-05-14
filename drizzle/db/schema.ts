import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  // basic fiel/folder info
  name: text("name").notNull(),
  path: text("path").notNull(), // /documents/project
  size: integer("size").notNull(),
  type: text("type").notNull(), //folder

  //storage info
  fileUrl: text("file_url").notNull(),
  thumbnail: text("thumbnail_url"),

  // ownership
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), // parent folder id ( null for root items)

  // file /folder flags
  isFolder: boolean("is_Folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_Trash").default(false).notNull(),

  //Timespan
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filerealtions = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
  //relationship to child file/folder
  Children: many(files),
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
