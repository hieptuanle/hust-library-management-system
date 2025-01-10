import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { userService } from "./user-service";
import type { Context } from "hono";

export class AuthService {
  cookieSecret = Bun.env.COOKIE_SECRET || "secret";
  async login(c: Context, username: string, password: string) {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return false;
    }
    const isPasswordCorrect = await Bun.password.verify(
      password,
      user.password || "",
    );
    if (!isPasswordCorrect) {
      return false;
    }
    console.log("secret", this.cookieSecret);
    await setSignedCookie(
      c,
      "user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        username: user.username,
        roles: user.roles,
      }),
      this.cookieSecret,
      {
        path: "/",
        secure: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      },
    );
    return true;
  }

  async logout(c: Context) {
    await deleteCookie(c, "user");
  }

  async getUser(c: Context) {
    const user = await getSignedCookie(c, this.cookieSecret, "user");
    console.log("user", user);
    if (!user) {
      return null;
    }
    return JSON.parse(user) as {
      id: string;
      name: string;
      username: string;
      roles: string[];
    };
  }

  async isLoggedIn(c: Context) {
    return await this.getUser(c) !== null;
  }
}

export const authService = new AuthService();
