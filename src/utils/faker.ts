import { fakerVI as faker } from "@faker-js/faker";

export const getRandomName = () => {
  return faker.person.fullName();
};

export const getRandomUsername = () => {
  return faker.internet.username();
};

export const getRandomEmail = () => {
  return faker.internet.email();
};

export const getRandomCellphone = () => {
  return faker.phone.number();
};

export const getRandomAddress = () => {
  return faker.location.streetAddress();
};

export const getRandomCardId = () => {
  return faker.string.numeric(10);
};

export const getRandomPassword = () => {
  return faker.internet.password();
};

export const getRandomBookTitle = () => {
  return faker.lorem.sentence();
};

export const getRandomBookAuthor = () => {
  return faker.person.fullName();
};

export const getRandomBookPublisher = () => {
  return faker.company.name();
};

export const getRandomBookYear = () => {
  return faker.date.past({
    years: 20,
  }).getFullYear();
};

export const getRandomBookGenre = () => {
  const genres = [
    "Truyện ngắn",
    "Tiểu thuyết",
    "Sách tham khảo",
    "Sách giáo khoa",
    "Văn học",
    "Khoa học",
    "Lịch sử",
    "Kinh tế",
    "Tâm lý học",
    "Kỹ năng sống",
    "Thiếu nhi",
    "Triết học",
    "Nghệ thuật",
    "Công nghệ",
    "Y học",
    "Ngoại ngữ",
    "Tôn giáo",
    "Chính trị",
    "Thể thao",
    "Nấu ăn",
  ];
  return faker.helpers.arrayElement(genres);
};

export const getRandomBookImageLink = () => {
  return faker.image.url({
    width: 90,
    height: 120,
  });
};

export const getRandomBookSlot = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  return faker.helpers.arrayElement(
    rows.map((row) => row + faker.helpers.arrayElement(columns)),
  );
};

export const getRandomCreatedAt = () => {
  return faker.date.recent({
    days: 30,
  }).toISOString();
};

export const getRandomBookQuantity = () => {
  return faker.number.int({
    min: 1,
    max: 10,
  });
};

export const randomAddress = () => {
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

export const randomCardId = () => {
  return Math.floor(Math.random() * 900000000 + 100000000).toString();
};

export const randomCellphone = () => {
  return "098" + Math.floor(Math.random() * 9000000 + 1000000).toString();
};
