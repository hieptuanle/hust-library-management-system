import { db } from "@/db/db";
import * as schema from "@/schema";
import { eq, getTableColumns } from "drizzle-orm";

class BookService {
  async getBookTitles() {
    return db.select({
      ...getTableColumns(schema.bookTitles),
      quantity: schema.bookInventory.quantity,
    }).from(schema.bookTitles).leftJoin(
      schema.bookInventory,
      eq(schema.bookTitles.id, schema.bookInventory.bookTitleId),
    );
  }
}

export const bookService = new BookService();
