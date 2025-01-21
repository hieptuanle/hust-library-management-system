import type { Child, FC } from "hono/jsx";
import Nav from "./nav";

const Layout: FC<{ title: string; children: Child }> = (props) => {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/static/favicon.ico" />
        <title>{props.title + " - Quản lý Thư viện"}</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossorigin="anonymous"
        ></script>
        <link rel="stylesheet" href="/static/styles.css" />
        <script
          src="https://unpkg.com/htmx.org@2.0.4"
          integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+"
          crossorigin="anonymous"
        ></script>
        <meta
          name="htmx-config"
          content='{
        "responseHandling":[
            {"code":"204", "swap": false},
            {"code":"[23]..", "swap": true},
            {"code":"422", "swap": true},
            {"code":"40[013]", "swap": true, "error":true},
            {"code":"[45]..", "swap": false, "error":true},
            {"code":"...", "swap": true}
        ]
    }'
        />
      </head>
      <body>
        <div
          id="modals-here"
          class="modal modal-blur fade"
          style="display: none"
          aria-hidden="false"
          tabindex={-1}
        >
          <div
            class="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div class="modal-content"></div>
          </div>
        </div>

        <div class="flex flex-col md:grid md:grid-cols-12 md:max-w-screen-lg mx-auto gap-2 p-2 min-h-screen">
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
        </div>
      </body>
    </html>
  );
};

export default Layout;
