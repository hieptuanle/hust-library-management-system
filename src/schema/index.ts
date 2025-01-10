import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import {
  array,
  email,
  minLength,
  pipe,
  string,
  transform,
  union,
} from "valibot";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  cellphone: text("cellphone").unique().notNull(),
  address: text("address").notNull(),
  password: text("password").notNull(),
  cardId: text("card_id").unique().notNull(),
  roles: text("roles", { mode: "json" }).$type<string[]>().default([]),
  createdAt: integer("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});

export const userInsertSchema = createInsertSchema(users, {
  email: pipe(string(), email()),
  username: pipe(
    string(),
    minLength(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  ),
  password: pipe(string(), minLength(8, "Mật khẩu phải có ít nhất 8 ký tự")),
  cardId: pipe(string(), minLength(10, "Mã thẻ phải có ít nhất 10 ký tự")),
  cellphone: pipe(
    string(),
    minLength(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  ),
  address: pipe(string(), minLength(5, "Địa chỉ phải có ít nhất 10 ký tự")),
  roles: pipe(
    union([array(string()), string()]),
    transform(
      (value) => (Array.isArray(value) ? value : [value]),
    ),
    minLength(1, "Phải có ít nhất 1 quyền"),
  ),
});

export const userSelectSchema = createSelectSchema(users);
