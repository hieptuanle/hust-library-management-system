import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import home from "./routes/home";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));
app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

app.route("/", home);

export default app;
