import express from "express";
import createClient from "./mcpClient.js";

const app = express();

// 解析 JSON 请求体
app.use(express.json());

// 添加 CORS 头
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// 处理前端页面请求
app.options("/analyze", (req, res) => {
  res.status(200).end();
});

// API endpoint to handle PDF analysis
app.post("/analyze", async (req, res) => {
  try {
    const mcpClient = await createClient();
    if (!mcpClient) {
      throw new Error("MCP Client not initialized");
    }

    const { pdfUrl } = req.body;
    console.log("Processing PDF from URL:", pdfUrl);

    // 第一步：将 PDF 转换为 Markdown
    console.log("Step 1: Converting PDF to Markdown...");
    const pdfResponse = await mcpClient.callTool({
      name: "parse-pdf-to-markdown",
      arguments: {
        pdfUrl,
      },
    });

    const markdown = pdfResponse.content;
    console.log("PDF successfully converted to markdown");

    // 将分析结果返回给客户端
    res.json(markdown);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
