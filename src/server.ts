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
      description: "Convert a local PDF file (file://) to Markdown text.",
      parameters: {
        pdfUrl: {
          type: "string",
          description: "Local PDF file URL (file:// protocol)",
        },
      },
      returns: {
        type: "object",
        description: "Markdown content extracted from the PDF.",
        properties: {
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["text"] },
                text: { type: "string" },
              },
            },
          },
          error: {
            type: "string",
            description: "Error message if any error occurred.",
          },
        },
      },
    },
    "analyze-media-kit": {
      description:
        "Analyze media kit Markdown content and return structured insights (audience, pricing, etc.)",
      parameters: {
        markdown: {
          type: "string",
          description: "Markdown content to analyze",
        },
      },
      returns: {
        type: "object",
        description: "Structured analysis result in JSON format.",
        properties: {
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["text"] },
                text: {
                  type: "string",
                  description: "JSON string of analysis result",
                },
              },
            },
          },
          error: {
            type: "string",
            description: "Error message if any error occurred.",
          },
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
