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

  async createUser(data: any) {
    const newUser = parse(schema.userInsertSchema, data);
    console.log("newUser", newUser);
    const amount = data.deposit as string;
    if (newUser.roles.includes("student") && !amount) {
      throw new Error("Số tiền cọc không được để trống cho học sinh");
    }
    const result = await db.transaction(async (tx) => {
      const result = await tx.insert(schema.users).values({
        ...newUser,
        password: await Bun.password.hash(newUser.password),
      }).returning();
      if (newUser.roles.includes("student") && amount) {
        await tx.insert(schema.depositTransactions).values({
          userId: result[0].id,
          amount: parseInt(amount),
        });
      }
      return result[0];
    });
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
