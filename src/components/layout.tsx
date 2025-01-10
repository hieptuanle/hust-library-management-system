import type { FC } from "hono/jsx";
import Nav from "./nav";

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="/static/styles.css" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body class="grid grid-cols-12 md:max-w-screen-md mx-auto gap-2 p-2">
        <Nav />
        <main class="col-span-12 md:col-span-9 p-2">{props.children}</main>
      </body>
    </html>
  );
};

export default Layout;
