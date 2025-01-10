import { db } from "@/db/db";
import { bookTitles, borrowRecords, users } from "@/schema";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

class ReportService {
  async getReport(type: string, from: string, to: string) {
    switch (type) {
      case "borrow-quantity-by-day": {
        const result = await db.select({
          label: sql<string>`DATE(${borrowRecords.createdAt})`,
          value: sql<number>`COUNT(${borrowRecords.id})`,
        })
          .from(borrowRecords)
          .where(
            and(
              gte(borrowRecords.createdAt, from),
              lte(borrowRecords.createdAt, to),
            ),
          )
          .groupBy(sql<string>`DATE(${borrowRecords.createdAt})`)
          .orderBy(desc(sql<number>`COUNT(${borrowRecords.id})`));
        return { data: result, columns: ["Ngày", "Số lượng"] };
      }
      case "new-student-by-day": {
        const result = await db.select({
          label: sql<string>`DATE(${users.createdAt})`,
          value: sql<number>`COUNT(${users.id})`,
        })
          .from(users)
          .where(
            and(
              gte(users.createdAt, from),
              lte(users.createdAt, to),
            ),
          )
          .groupBy(sql<string>`DATE(${users.createdAt})`)
          .orderBy(desc(sql<number>`COUNT(${users.id})`));
        return { data: result, columns: ["Ngày", "Số lượng"] };
      }
      case "top-borrow-by-title": {
        const result = await db.select({
          label: bookTitles.name,
          value: sql<number>`COUNT(${borrowRecords.id})`,
        })
          .from(borrowRecords)
          .innerJoin(bookTitles, eq(borrowRecords.bookTitleId, bookTitles.id))
          .groupBy(bookTitles.name)
          .orderBy(desc(sql<number>`COUNT(${borrowRecords.id})`));
        return { data: result, columns: ["Tên sách", "Số lượng"] };
      }
    }
    return null;
  }
}

export const reportService = new ReportService();
