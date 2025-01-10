import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  roles: text("roles", { mode: "json" }).$type<string[]>().default([]),
  createdAt: integer("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
