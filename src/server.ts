import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { deepseekClient } from "./helper/deepseek.js";
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

server.tool(
  "abstract-media-kit-main-content",
  {
    markdown: z.string().describe("Markdown content to summarize"),
  },
  async (params: MarkdownParams) => {
    try {
      console.error("Abstracting media kit content");

      // 使用 DeepSeek 生成摘要
      const summary = await deepseekClient.summarizeContent(params.markdown);

      return {
        content: [
          {
            type: "text",
            text: summary,
          },
        ],
      };
    } catch (error) {
      console.error("Error abstracting content:", error);
      throw error;
    }
  }
);

export default server;
