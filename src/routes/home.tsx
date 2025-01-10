import { Hono } from "hono";
import Layout from "../components/layout";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <Layout>
      <div class="prose">
        <h2>Chào mừng</h2>
        <p>
          Chào mừng đến với hệ thống quản lý thư viện THPT. Phần mềm cung cấp
          các chức năng bao gồm:
        </p>
        <ul>
          <li>Quản lý sách</li>
          <li>Quản lý độc giả</li>
          <li>Quản lý mượn sách</li>
        </ul>
      </div>
    </Layout>
  );
});

export default app;
