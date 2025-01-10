import { Hono } from "hono";
import LoginForm from "@/components/login-form";
import { authService } from "@/modules/auth-service";

const authRoutes = new Hono();

authRoutes.get("/login", async (c) => {
  return c.render(
    <LoginForm username="hieple" password="12345678" message="" />,
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
