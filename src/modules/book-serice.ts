import { db } from "@/db/db";
import * as schema from "@/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";

class BookService {
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
