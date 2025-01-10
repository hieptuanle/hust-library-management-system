import { db } from "@/db/db";
import * as schema from "@/schema";

await db.delete(schema.users);
await db.insert(schema.users).values([
  {
    name: "Lê Tuấn Hiệp",
    username: "hieple",
    email: "hieptuanle@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["admin"],
  },
  {
    name: "Lại Thị Ngọc Dung",
    username: "dungngoclai",
    email: "dungngoclai@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["librarian"],
  },
  {
    name: "Trần Quang Lâm",
    username: "lamtran",
    email: "lamtran@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["student"],
  },
  {
    name: "Nguyễn Tùng Lộc",
    username: "locnguyen",
    email: "locnguyen@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["student"],
  },
  {
    name: "Nguyễn Hồng Lĩnh",
    username: "linhnguyen",
    email: "linhnguyen@gmail.com",
    password: await Bun.password.hash("12345678"),
    roles: ["student"],
  },
]);
