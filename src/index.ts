import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import mcpServer from "./server.js";

// 主函数
async function main() {
  try {
    // 创建 stdio 传输层
    const transport = new StdioServerTransport();

    // 连接服务器到传输层
    await mcpServer.connect(transport);
    console.error("MCP server started successfully");

    // 处理进程终止信号
    process.on("SIGINT", () => {
      console.error("Received SIGINT signal, shutting down server");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.error("Received SIGTERM signal, shutting down server");
      process.exit(0);
    });

    // 处理未捕获的异常
    process.on("uncaughtException", (err: Error) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });

    // 处理未处理的 Promise 拒绝
    process.on(
      "unhandledRejection",
      (reason: unknown, promise: Promise<unknown>) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
        process.exit(1);
      }
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

// 启动服务器
main().catch((error: Error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
