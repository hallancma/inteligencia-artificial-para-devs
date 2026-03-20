import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
const PORT = process.env.PORT || 3000;

app.use('*', cors());

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.onError((err, c) => {
  console.error(err.stack);
  return c.json(
    { error: 'Something went wrong!', message: err.message },
    500
  );
});

console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
