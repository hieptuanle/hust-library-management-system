import { Hono } from "hono";
import Layout from "../components/layout";
import { authService } from "@/modules/auth-service";

const app = new Hono();

app.get("/", async (c) => {
  const user = await authService.getUser(c);
  return c.html(
    <Layout title="Trang chủ">
      <div class="prose">
        <p>
          Xin chào {user ? user.name : "bạn"} đã đến với hệ thống quản lý thư
          viện THPT. Phần mềm cung cấp các chức năng bao gồm: cung cấp các chức
          năng bao gồm:
        </p>
        <ul>
          <li>Quản lý sách</li>
          <li>Quản lý độc giả</li>
          <li>Quản lý mượn sách</li>
        </ul>
        {user ? (
          <p>
            Bạn có thể đăng xuất bằng cách nhấn vào nút{" "}
            <a href="/auth/logout">Đăng xuất</a>
          </p>
        ) : (
          <p>
            Bạn có thể đăng nhập bằng cách nhấn vào nút{" "}
            <a href="/auth/login">Đăng nhập</a>
          </p>
        )}
      </div>
    </Layout>
  );
});

export default app;
