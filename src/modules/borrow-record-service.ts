import { db } from "@/db/db";
import {
  bookInventory,
  bookTitles,
  bookTransactions,
  borrowRecordInsertSchema,
  borrowRecords,
  users,
} from "@/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { parse } from "valibot";

class BorrowRecordService {
  async createBorrowRecord(data: any) {
    const validatedBorrowRecord = parse(borrowRecordInsertSchema, data);
    return db.transaction(async (tx) => {
      const borrowRecordResults = await tx
        .insert(borrowRecords)
        .values(validatedBorrowRecord)
        .returning();

      const borrowRecord = borrowRecordResults[0];
      await tx
        .insert(bookTransactions)
        .values({
          bookTitleId: borrowRecord.bookTitleId,
          quantity: borrowRecord.quantity,
          borrowRecordId: borrowRecord.id,
          description: "Mượn sách",
          userId: borrowRecord.userId,
        });

      await tx
        .update(bookInventory)
        .set({
          quantity: sql`${bookInventory.quantity} - ${borrowRecord.quantity}`,
        })
        .where(eq(bookInventory.bookTitleId, borrowRecord.bookTitleId));

      return borrowRecord;
    });
  }

  async returnBorrowRecord(borrowRecordId: number) {
    return db.transaction(async (tx) => {
      const borrowRecordResults = await tx
        .update(borrowRecords)
        .set({ returnedAt: new Date().toISOString() })
        .where(eq(borrowRecords.id, borrowRecordId))
        .returning();
      if (borrowRecordResults.length === 0) {
        throw new Error("Không tìm thấy phiếu mượn");
      }
      const borrowRecord = borrowRecordResults[0];
      await tx
        .insert(bookTransactions)
        .values({
          bookTitleId: borrowRecord.bookTitleId,
          quantity: borrowRecord.quantity,
          borrowRecordId: borrowRecord.id,
          description: "Trả sách",
          userId: borrowRecord.userId,
        });

      await tx
        .update(bookInventory)
        .set({
          quantity: sql`${bookInventory.quantity} + ${borrowRecord.quantity}`,
        })
        .where(eq(bookInventory.bookTitleId, borrowRecord.bookTitleId));
      return borrowRecord;
    });
  }
  async getBorrowRecords() {
    return await db
      .select({
        ...getTableColumns(borrowRecords),
        userName: users.name,
        userCellphone: users.cellphone,
        bookTitleName: bookTitles.name,
      })
      .from(borrowRecords)
      .leftJoin(users, eq(borrowRecords.userId, users.id))
      .leftJoin(bookTitles, eq(borrowRecords.bookTitleId, bookTitles.id))
      .execute();
  }
}

const borrowRecordService = new BorrowRecordService();
export default borrowRecordService;
