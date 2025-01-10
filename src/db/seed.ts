import { db } from "@/db/db";
import * as schema from "@/schema";
import {
  getRandomBookAuthor,
  getRandomBookGenre,
  getRandomBookImageLink,
  getRandomBookPublisher,
  getRandomBookQuantity,
  getRandomBookSlot,
  getRandomBookTitle,
  getRandomBookYear,
  getRandomCreatedAt,
  randomAddress,
  randomCardId,
  randomCellphone,
} from "@/utils/faker";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { sql } from "drizzle-orm";

await db.delete(schema.users);
await db.insert(schema.users).values([
  {
    name: "Lê Tuấn Hiệp",
    username: "hieple",
    email: "hieptuanle@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["admin"],
    cellphone: randomCellphone(),
    address: randomAddress(),
    cardId: randomCardId(),
  },
  {
    name: "Lại Thị Ngọc Dung",
    username: "dungngoclai",
    email: "dungngoclai@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["librarian"],
    cellphone: randomCellphone(),
    address: randomAddress(),
    cardId: randomCardId(),
  },
  {
    name: "Trần Quang Lâm",
    username: "lamtran",
    email: "lamtran@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["student"],
    cellphone: randomCellphone(),
    address: randomAddress(),
    cardId: randomCardId(),
  },
  {
    name: "Nguyễn Tùng Lộc",
    username: "locnguyen",
    email: "locnguyen@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["student"],
    cellphone: randomCellphone(),
    address: randomAddress(),
    cardId: randomCardId(),
  },
  {
    name: "Nguyễn Hồng Lĩnh",
    username: "linhnguyen",
    email: "linhnguyen@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["student"],
    cellphone: randomCellphone(),
    address: randomAddress(),
    cardId: randomCardId(),
  },
]);

await db.delete(schema.depositTransactions);
await db.insert(schema.depositTransactions).values([
  {
    userId: 3,
    amount: 200000,
  },
  {
    userId: 4,
    amount: 200000,
  },
  {
    userId: 5,
    amount: 200000,
  },
]);

await db.delete(schema.bookTitles);
const bookTitles = Array.from({ length: 200 }).map(() => ({
  name: getRandomBookTitle(),
  author: getRandomBookAuthor(),
  publisher: getRandomBookPublisher(),
  year: getRandomBookYear(),
  genre: getRandomBookGenre(),
  imageLink: getRandomBookImageLink(),
  slot: getRandomBookSlot(),
}));
await db.insert(schema.bookTitles).values(bookTitles);

const borrowRecords = [
  {
    userId: 3,
    quantity: 1,
    bookTitleId: 1,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: getRandomCreatedAt(),
    returnedAt: null,
  },
  {
    userId: 4,
    quantity: 1,
    bookTitleId: 2,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
    createdAt: getRandomCreatedAt(),
    returnedAt: null,
  },
  {
    userId: 5,
    quantity: 1,
    bookTitleId: 3,
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
    createdAt: getRandomCreatedAt(),
    returnedAt: null,
  },
];
await db.delete(schema.borrowRecords);
await db.insert(schema.borrowRecords).values(borrowRecords);

await db.delete(schema.bookTransactions);
const randomImportTransactions = bookTitles.map((bookTitle, index) => ({
  description: "Nhập sách",
  quantity: getRandomBookQuantity(),
  userId: 2,
  bookTitleId: index + 1,
  borrowRecordId: null,
  createdAt: getRandomCreatedAt(),
}));
await db.insert(schema.bookTransactions).values(
  [
    ...borrowRecords.map((borrowRecord, index) => ({
      description: "Mượn sách",
      quantity: -borrowRecord.quantity,
      userId: borrowRecord.userId,
      bookTitleId: borrowRecord.bookTitleId,
      borrowRecordId: index + 1,
      createdAt: borrowRecord.createdAt,
    })),
    ...randomImportTransactions,
    ...faker.helpers.arrayElements(randomImportTransactions.slice(3, 200), 50)
      .map((
        bookTransaction,
        index,
      ) => ({
        description: "Sách cũ",
        quantity: -bookTransaction.quantity,
        userId: bookTransaction.userId,
        bookTitleId: bookTransaction.bookTitleId,
        borrowRecordId: null,
        createdAt: dayjs(bookTransaction.createdAt).add(1, "day").toISOString(),
      })),
  ],
);

const bookInventories = await db.select({
  bookTitleId: schema.bookTransactions.bookTitleId,
  quantity: sql<number>`sum(${schema.bookTransactions.quantity})`,
}).from(schema.bookTransactions)
  .groupBy(schema.bookTransactions.bookTitleId)
  .execute();

await db.delete(schema.bookInventory);
await db.insert(schema.bookInventory).values(bookInventories);
