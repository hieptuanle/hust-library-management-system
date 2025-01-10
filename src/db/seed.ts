import { db } from "@/db/db";
import * as schema from "@/schema";

const randomAddress = () => {
  return `${Math.floor(Math.random() * 300 + 1)} Phố ${
    [
      "Đội Cấn",
      "Láng Hạ",
      "Lê Duẩn",
      "Trần Duy Hưng",
      "Kim Mã",
    ][Math.floor(Math.random() * 5)]
  }, ${
    [
      "Ba Đình",
      "Đống Đa",
      "Hoàn Kiếm",
      "Cầu Giấy",
      "Hai Bà Trưng",
    ][Math.floor(Math.random() * 5)]
  }, Hà Nội`;
};

const randomCardId = () => {
  return Math.floor(Math.random() * 900000000 + 100000000).toString();
};

const randomCellphone = () => {
  return "098" + Math.floor(Math.random() * 9000000 + 1000000).toString();
};

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
