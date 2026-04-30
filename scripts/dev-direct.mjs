import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { startServer } = require("next/dist/server/lib/start-server");

const dir = path.resolve(".");
const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOSTNAME ?? "127.0.0.1";

await startServer({
  dir,
  port,
  hostname,
  allowRetry: false,
  isDev: true
});

await new Promise(() => {});
