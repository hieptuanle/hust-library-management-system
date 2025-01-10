import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import homeRoutes from "./routes/home.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import { jsxRenderer } from "hono/jsx-renderer";
import Layout from "./components/layout";
import bookTitlesRoutes from "./routes/book-titles.routes";
import bookTransactionsRoutes from "./routes/book-transactions.routes";
import borrowRecordsRoutes from "./routes/borrow-records.routes";
import reportRoutes from "./routes/reports.routes";
import { etag } from "hono/etag";

const app = new Hono();

app.use("static/*", etag());
app.use("/static/*", serveStatic({ root: "./" }));

app.use(
  "*",
  jsxRenderer(({ children, title }) => {
    return <Layout title={title}>{children}</Layout>;
  })
);

app.route("/", homeRoutes);
app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/book-titles", bookTitlesRoutes);
app.route("/book-transactions", bookTransactionsRoutes);
app.route("/borrow-records", borrowRecordsRoutes);
app.route("/reports", reportRoutes);
export default {
  fetch: app.fetch,
  port: Bun.env.PORT || 3000,
};
