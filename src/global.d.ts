import "typed-htmx";

declare module "hono/jsx" {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props: { title: string },
    ): Response;
  }
}
