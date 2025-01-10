import {
  bookInventory,
  bookTitles,
  bookTransactionInsertSchema,
  bookTransactions,
  users,
} from "@/schema";
import { db } from "@/db/db";
import { parse } from "valibot";
import { desc, eq, getTableColumns } from "drizzle-orm";

export class BookTransactionService {
  async getBookTransactions() {
    return await db
      .select({
        ...getTableColumns(bookTransactions),
        bookTitleName: bookTitles.name,
        userName: users.name,
      })
      .from(bookTransactions)
      .leftJoin(bookTitles, eq(bookTransactions.bookTitleId, bookTitles.id))
      .leftJoin(users, eq(bookTransactions.userId, users.id))
      .orderBy(desc(bookTransactions.id));
  }

  async createBookTransaction(bookTransaction: any) {
    const validatedBookTransaction = parse(
      bookTransactionInsertSchema,
      bookTransaction,
    );

    await db.transaction(async (tx) => {
      const bookTitle = await tx.select().from(bookTitles).where(
        eq(bookTitles.id, validatedBookTransaction.bookTitleId),
      ).execute();
      if (bookTitle.length === 0) {
        throw new Error("Sách không tồn tại");
      }
      let bookInventoryEntry = await tx.select().from(bookInventory).where(
        eq(bookInventory.bookTitleId, validatedBookTransaction.bookTitleId),
      ).execute();

      if (bookInventoryEntry.length === 0) {
        bookInventoryEntry = await tx.insert(bookInventory).values({
          bookTitleId: validatedBookTransaction.bookTitleId,
          quantity: 0,
        }).returning();
      }

      const afterTransactionQuantity = bookInventoryEntry[0].quantity +
        validatedBookTransaction.quantity;
      if (afterTransactionQuantity < 0) {
        throw new Error(
          `Số lượng sách sau khi tạo phiếu nhập/xuất không được nhỏ hơn 0. Số lượng sách còn lại: ${afterTransactionQuantity}`,
        );
      }

      await tx.insert(bookTransactions).values(validatedBookTransaction)
        .execute();

      await tx.update(bookInventory).set({
        quantity: afterTransactionQuantity,
      }).where(
        eq(bookInventory.bookTitleId, validatedBookTransaction.bookTitleId),
      ).execute();
    });
  }
}

export const bookTransactionService = new BookTransactionService();
