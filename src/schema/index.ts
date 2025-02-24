import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-valibot";
import {
  array,
  email,
  minLength,
  minValue,
  number,
  pipe,
  string,
  transform,
  union,
} from "valibot";

export const users = sqliteTable("users", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  cellphone: text("cellphone").unique().notNull(),
  address: text("address").notNull(),
  password: text("password").notNull(),
  cardId: text("card_id").unique().notNull(),
  roles: text("roles", { mode: "json" }).$type<string[]>().default([]),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
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

export const depositTransactions = sqliteTable("deposit_transactions", {
  id: int("id").primaryKey(),
  userId: int("user_id").references(() => users.id),
  amount: int("amount").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bookTitles = sqliteTable("book_titles", {
  id: int("id").primaryKey(),
  imageLink: text("image_link").notNull(),
  name: text("name").notNull(),
  author: text("author").notNull(),
  publisher: text("publisher").notNull(),
  year: int("year").notNull(),
  genre: text("genre").notNull(),
  slot: text("slot").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bookTitleInsertSchema = createInsertSchema(bookTitles, {
  name: pipe(string(), minLength(3, "Tên sách phải có ít nhất 3 ký tự")),
  author: pipe(string(), minLength(3, "Tên tác giả phải có ít nhất 3 ký tự")),
  publisher: pipe(
    string(),
    minLength(3, "Nhà xuất bản phải có ít nhất 3 ký tự"),
  ),
  year: pipe(
    union([number(), string()]),
    transform(Number),
    minValue(0, "Năm xuất bản phải lớn hơn 0"),
  ),
});
export const bookTitleUpdateSchema = createUpdateSchema(bookTitles, {
  name: pipe(string(), minLength(3, "Tên sách phải có ít nhất 3 ký tự")),
  author: pipe(string(), minLength(3, "Tên tác giả phải có ít nhất 3 ký tự")),
  publisher: pipe(
    string(),
    minLength(3, "Nhà xuất bản phải có ít nhất 3 ký tự"),
  ),
  year: pipe(
    union([number(), string()]),
    transform(Number),
    minValue(0, "Năm xuất bản phải lớn hơn 0"),
  ),
});

export const bookTransactions = sqliteTable("book_transactions", {
  id: int("id").primaryKey(),
  bookTitleId: int("book_title_id").references(() => bookTitles.id),
  quantity: int("quantity").notNull(),
  borrowRecordId: int("borrow_record_id").references(() => borrowRecords.id),
  description: text("description").notNull(),
  userId: int("user_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bookTransactionInsertSchema = createInsertSchema(
  bookTransactions,
  {
    bookTitleId: pipe(
      union([number(), string()]),
      transform(Number),
      minValue(0, "Mã sách phải lớn hơn 0"),
    ),
    quantity: pipe(
      union([number(), string()]),
      transform(Number),
    ),
    description: pipe(string(), minLength(3, "Mô tả phải có ít nhất 3 ký tự")),
  },
);

export const bookInventory = sqliteTable("book_inventory", {
  id: int("id").primaryKey(),
  bookTitleId: int("book_title_id").references(() => bookTitles.id),
  quantity: int("quantity").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const borrowRecords = sqliteTable("borrow_records", {
  id: int("id").primaryKey(),
  bookTitleId: int("book_title_id").references(() => bookTitles.id).notNull(),
  quantity: int("quantity").notNull(),
  userId: int("user_id").references(() => users.id).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  dueDate: text("due_date").notNull(),
  returnedAt: text("returned_at"),
});

export const borrowRecordInsertSchema = createInsertSchema(borrowRecords, {
  bookTitleId: pipe(
    union([number(), string()]),
    transform(Number),
    minValue(0, "Mã sách phải lớn hơn 0"),
  ),
  quantity: pipe(
    union([number(), string()]),
    transform(Number),
    minValue(0, "Số lượng phải lớn hơn 0"),
  ),
  userId: pipe(
    union([number(), string()]),
    transform(Number),
    minValue(0, "Mã người mượn phải lớn hơn 0"),
  ),
});
