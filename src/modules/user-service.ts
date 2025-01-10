import { db } from "@/db/db";
import * as schema from "@/schema";
import { eq } from "drizzle-orm";
import { parse, ValiError } from "valibot";

export class UserService {
  async getUsers() {
    const users = await db.select().from(schema.users);
    return users;
  }

  async checkPassword(username: string, password: string) {
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (!users || !users[0]) {
      return false;
    }

    return await Bun.password.verify(password, users[0].password || "");
  }

  async getUserByUsername(username: string) {
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (!users || !users[0]) {
      return null;
    }

    return users[0];
  }

  async createUser(user: any) {
    const newUser = parse(schema.userInsertSchema, user);
    console.log("newUser", newUser);
    const result = await db.insert(schema.users).values(newUser);
    console.log(result);
    return result;
  }

  getCreateUserErrorMessage(
    error: ValiError<typeof schema.userInsertSchema> | Error,
  ) {
    if (error instanceof ValiError) {
      return error.issues.map((issue) => issue.message).join(", ");
    }
    return error.message;
  }
}

export const userService = new UserService();
