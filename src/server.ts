import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { Markdownify } from "./helper/markdownify.js";
import { deepseekClient } from "./helper/deepseek.js";
import { MarkdownParams, PDFParams } from "./type/common.js";

// 创建 MCP 服务器实例
const server = new McpServer({
  name: "media_kit_mcp",
  version: "1.3.0",
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
    "analyze-media-kit": {
      description:
        "Comprehensive analysis of media kit content including target audience, pricing structure, and marketing insights",
      parameters: {
        markdown: {
          type: "string",
          description: "Markdown content to analyze",
        },
      },
    },
  },
});

// PDF 转换工具
server.tool(
  "parse-pdf-to-markdown",
  {
    pdfUrl: z.string().describe("Local PDF file URL (file:// protocol)"),
  },
  async (params: PDFParams) => {
    try {
      console.error(`Processing PDF from path: ${params.pdfUrl}`);

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

// 综合分析工具
server.tool(
  "analyze-media-kit",
  {
    markdown: z.string().describe("Markdown content to analyze"),
  },
  async (params: MarkdownParams) => {
    try {
      console.error("Starting comprehensive media kit analysis");

      const analysis = await deepseekClient.analyzeComprehensive(
        params.markdown
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error in comprehensive analysis:", error);
      throw error;
    }
  }
);

export default server;
