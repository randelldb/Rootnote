import { buildServer } from "./server.js";

const port = Number(process.env.API_PORT ?? 3333);
const host = process.env.API_HOST ?? "0.0.0.0";
const server = buildServer();

async function main() {
  try {
    await server.listen({ port, host });
    server.log.info(`API listening on http://${host}:${port}`);
  } catch (error) {
    server.log.error(error, "Failed to start server");
    process.exit(1);
  }
}

void main();
