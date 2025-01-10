import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import home from "./routes/home";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { jsxRenderer } from "hono/jsx-renderer";
import Layout from "./components/layout";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.use(
  "*",
  jsxRenderer(({ children, title }) => {
    return <Layout title={title}>{children}</Layout>;
  })
);

app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/", home);

export default app;
