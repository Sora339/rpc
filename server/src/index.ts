import http from "node:http";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { connectNodeAdapter } from "@connectrpc/connect-node";
import routes from "./connect.js";

// Hono app for non-RPC routes
const app = new Hono();
app.get("/", (c) => c.text("Hono + Connect RPC server"));
app.get("/health", (c) => c.json({ ok: true }));

// Helper: adapt Node req/res to Fetch for Hono
async function handleWithHono(req: any, res: any) {
  const url = `http://${req.headers.host}${req.url}`;
  const init: RequestInit = {
    method: req.method,
    headers: req.headers as any,
    body: req.method && ["GET", "HEAD"].includes(req.method) ? undefined : (req as any),
    // @ts-expect-error Node stream is acceptable for Request in Node 18+
    duplex: "half",
  };
  const request = new Request(url, init as any);
  const response = await app.fetch(request);
  res.statusCode = response.status;
  response.headers.forEach((value: string, key: string) => res.setHeader(key, value));
  const buf = Buffer.from(await response.arrayBuffer());
  res.end(buf);
}

// Mount Connect RPC under prefix /rpc
const connectHandler = connectNodeAdapter({
  routes,
  requestPathPrefix: "/rpc",
  fallback: (req, res) => {
    // Delegate non-RPC paths to Hono
    void handleWithHono(req, res);
  },
});

// Start server on 3000
http.createServer(connectHandler).listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("Server listening on http://localhost:3000\n- RPC:   http://localhost:3000/rpc\n- Hono:  http://localhost:3000/");
});
