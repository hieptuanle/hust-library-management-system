import { db } from "@/db/db";
import * as schema from "@/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { parse } from "valibot";

class BookService {
  async deleteBookTitle(id: number) {
    await db.delete(schema.bookTitles).where(
      eq(schema.bookTitles.id, id),
    ).execute();
    await db.delete(schema.bookInventory).where(
      eq(schema.bookInventory.bookTitleId, id),
    ).execute();
  }

  async createBookTitle(data: any) {
    const parsedData = parse(schema.bookTitleInsertSchema, data);
    await db.insert(schema.bookTitles).values(parsedData).execute();
  }

  async updateBookTitle(id: number, data: any) {
    const parsedData = parse(schema.bookTitleUpdateSchema, data);
    await db.update(schema.bookTitles).set(parsedData).where(
      eq(schema.bookTitles.id, id),
    ).execute();
  }

  async getBookTitleById(id: number) {
    const results = await db.select().from(schema.bookTitles).where(
      eq(schema.bookTitles.id, id),
    ).execute();
    if (results.length === 0) {
      return null;
    }
    return results[0];
  }

  async getBookTitles(q: string = "", page: number = 1, pageSize: number = 20) {
    const query = db.select({
      ...getTableColumns(schema.bookTitles),
      quantity: schema.bookInventory.quantity,
    }).from(schema.bookTitles).leftJoin(
      schema.bookInventory,
      eq(schema.bookTitles.id, schema.bookInventory.bookTitleId),
    );
    if (q) {
      query.where(
        sql`${schema.bookTitles.name} LIKE ${"%" + q + "%"}`,
      );
    }
    if (page) {
      query.limit(pageSize).offset((page - 1) * pageSize);
    }
    return query.execute();
  }

  async getBookTitlesCount(q: string = "") {
    const query = db.select({
      count: sql<number>`COUNT(*)`,
    }).from(schema.bookTitles);
    return query.execute().then((res) => res[0].count);
  }
}

export const bookService = new BookService();
