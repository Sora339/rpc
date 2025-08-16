import type { ConnectRouter } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_connect.js";

export default (router: ConnectRouter) =>
  router.service(ElizaService, {
    async say(req) {
      // 実際の通信内容をログ出力
      console.log("🔄 gRPC/Connect Request received:");
      console.log("📨 Input:", req);
      console.log("📍 Method: Say");
      console.log("🌐 Protocol: Connect (gRPC-Web compatible)");
      
      const response = { sentence: `You said: ${req.sentence}` };
      
      console.log("📤 Response:", response);
      console.log("---");
      
      return response;
    },
  });
