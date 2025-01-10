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

  async getBookTitles(q: string = "") {
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
    return query.execute();
  }
}

export const bookService = new BookService();
