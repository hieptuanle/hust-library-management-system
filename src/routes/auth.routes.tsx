import { Hono } from "hono";
import LoginForm from "@/components/login-form";
import { authService } from "@/modules/auth-service";

const authRoutes = new Hono();

authRoutes.get("/login", async (c) => {
  return c.render(
    <div>
      <LoginForm username="hieple" password="12345678" message="" />
      <div class="flex flex-col gap-2 mt-4">
        <p>Các tài khoản mẫu</p>
        <div class="flex flex-col gap-2">
          <details class="border border-slate-400 rounded-md p-2">
            <summary class="cursor-pointer">Admin</summary>
            <p>Username: hieple</p>
            <p>Password: 12345678</p>
          </details>
          <details class="border border-slate-400 rounded-md p-2">
            <summary class="cursor-pointer">Librarian</summary>
            <p>Username: dungngoclai</p>
            <p>Password: 12345678</p>
          </details>
          <details class="border border-slate-400 rounded-md p-2">
            <summary class="cursor-pointer">Student</summary>
            <p>Username: lamtran</p>
            <p>Password: 12345678</p>
          </details>
        </div>
      </div>
    </div>,
    {
      title: "Đăng nhập",
    }
  );
});

authRoutes.post("/login", async (c) => {
  const formData = await c.req.parseBody();
  const isPasswordCorrect = await authService.login(
    c,
    formData.username as string,
    formData.password as string
  );
  if (isPasswordCorrect) {
    c.header("HX-Redirect", "/");
    return c.html(<p>Đăng nhập thành công.</p>);
  }

  c.status(401);

  return c.html(
    <LoginForm
      username={formData.username as string}
      password={formData.password as string}
      message="Tên đăng nhập hoặc mật khẩu không đúng"
    />
  );
});

authRoutes.get("/logout", async (c) => {
  await authService.logout(c);
  c.status(200);
  return c.redirect("/");
});

export default authRoutes;
