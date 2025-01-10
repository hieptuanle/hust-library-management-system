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
