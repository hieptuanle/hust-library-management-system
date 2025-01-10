import { db } from "./db";
import * as schema from "./schema";

await db.delete(schema.users);
await db.insert(schema.users).values([
  {
    name: "Lê Tuấn Hiệp",
    email: "hieptuanle@gmail.com",
    password: "12345678",
    roles: ["admin"],
  },
  {
    name: "Lại Thị Ngọc Dung",
    email: "dungngoclai@gmail.com",
    password: "12345678",
    roles: ["librarian"],
  },
  {
    name: "Trần Quang Lâm",
    email: "lamtran@gmail.com",
    password: "12345678",
    roles: ["student"],
  },
  {
    name: "Nguyễn Tùng Lộc",
    email: "locnguyen@gmail.com",
    password: "12345678",
    roles: ["student"],
  },
  {
    name: "Nguyễn Hồng Lĩnh",
    email: "linhnguyen@gmail.com",
    password: "12345678",
    roles: ["student"],
  },
]);
