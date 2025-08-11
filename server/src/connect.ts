import type { ConnectRouter } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_connect.js";

export default (router: ConnectRouter) =>
  router.service(ElizaService, {
    async say(req) {
      return { sentence: `You said: ${req.sentence}` };
    },
  });
