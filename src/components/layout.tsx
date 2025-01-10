import type { Child, FC } from "hono/jsx";
import Nav from "./nav";

const Layout: FC<{ title: string; children: Child }> = (props) => {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/static/favicon.ico" />
        <title>{props.title + " - Quản lý Thư viện"}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <script
          src="https://unpkg.com/htmx.org@2.0.4"
          integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+"
          crossorigin="anonymous"
        ></script>
      </head>
      <body class="flex flex-col md:grid md:grid-cols-12 md:max-w-screen-md mx-auto gap-2 p-2 min-h-screen">
        <Nav />
        <article class="col-span-12 md:col-span-9 p-2 flex flex-col gap-2 md:h-full border border-gray-300 rounded-md grow">
          <header>
            <h1 class="text-xl font-bold">{props.title}</h1>
          </header>
          <main class="grow">{props.children}</main>
          <footer class="text-center text-sm text-gray-500">
            <p>Copyright © 2025 Quản lý Thư viện</p>
          </footer>
        </article>
      </body>
    </html>
  );
};

export default Layout;
