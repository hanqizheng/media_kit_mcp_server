import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Markdownify } from "./helper/markdownify.js";
import { z } from "zod";

// 定义参数类型
interface PDFParams {
  pdfUrl: string;
}

interface MarkdownParams {
  markdown: string;
}

// 创建 MCP 服务器实例
const server = new McpServer({
  name: "media_kit_mcp",
  version: "1.1.0",
  capabilities: {
    "parse-pdf-to-markdown": {
      description: "Parse a local PDF file to markdown",
      parameters: {
        pdfUrl: {
          type: "string",
          description: "Local PDF file URL (file:// protocol)",
        },
      },
    },
  },
});

// 添加工具
server.tool(
  "parse-pdf-to-markdown",
  {
    pdfUrl: z.string().describe("Local PDF file URL (file:// protocol)"),
  },
  async (params: PDFParams) => {
    try {
      console.error(`Processing PDF from path: ${params.pdfUrl}`);

      // 直接使用 Markdownify 处理本地 PDF 文件
      const markdownResult = await Markdownify.toMarkdown(params.pdfUrl);
      console.error(`PDF converted to markdown: ${markdownResult.path}`);

      return {
        content: [
          {
            type: "text",
            text: markdownResult.text,
          },
        ],
      };
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error parsing PDF: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

export default server;
