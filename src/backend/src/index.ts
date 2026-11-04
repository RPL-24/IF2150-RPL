import { desc } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as schema from './db/schema';

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
  return c.text('Hello world!');
});

app.get('/health', async (c) => {
  const db = drizzle(c.env.D1, { schema });

  const [latest] = await db
    .select()
    .from(schema.statusServer)
    .orderBy(desc(schema.statusServer.waktuCek))
    .limit(1);
  return Response.json({ ok: true, latest: latest ?? null });
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;

