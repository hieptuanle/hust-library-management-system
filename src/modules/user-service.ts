import { db } from "@/db/db";
import * as schema from "@/schema";
import { eq } from "drizzle-orm";

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
}

export const userService = new UserService();
