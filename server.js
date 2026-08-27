import { createServer } from "node:http";
import next from "next";

const hostname = "0.0.0.0";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

try {
  await app.prepare();
} catch (error) {
  console.error("Failed to prepare Next.js:", error);
  process.exit(1);
}

const server = createServer(async (request, response) => {
  try {
    await handle(request, response);
  } catch (error) {
    console.error("Unhandled request error:", error);
    if (!response.headersSent) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
    }
    if (!response.writableEnded) response.end("Internal Server Error");
  }
});

server.on("clientError", (error, socket) => {
  console.error("Client connection error:", error.message);
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, hostname, () => {
  console.log(`Next.js listening on http://${hostname}:${port}`);
});
