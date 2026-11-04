import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
  return c.text('Hello world!');
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;

