import { Hono } from "hono";
import Layout from "@/components/layout";
import LoginForm from "@/components/login-form";
import { authService } from "@/modules/auth-service";

const authRoutes = new Hono();

authRoutes.get("/login", async (c) => {
  return c.html(
    <Layout title="Đăng nhập">
      <LoginForm username="hieple" password="12345678" message="" />
    </Layout>
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
  return c.html(
    <Layout title="Đăng xuất">
      <p>Đăng xuất thành công. Chuyển hướng về trang chủ sau 1 giây...</p>
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(() => {
          window.location.href = "/";
        }, 1000);`,
        }}
      />
    </Layout>
  );
});

export default authRoutes;
