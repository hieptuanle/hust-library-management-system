import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import home from "./routes/home";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/", home);

export default app;
