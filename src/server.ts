import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// 定义参数类型
interface PDFParams {
  pdfUrl: string;
}

interface MarkdownParams {
  markdown: string;
}

// 创建 MCP 服务器实例
const mcpServer = new McpServer({
  name: "media_kit_mcp",
  version: "1.0.0",
  capabilities: {
    tools: {
      "parse-pdf-to-markdown": {
        description: "Parse PDF to markdown",
        parameters: {
          pdfUrl: {
            type: "string",
            description: "URL of the PDF to parse",
          },
        },
      },
    },
  },
});

mcpServer.tool(
  "parse-pdf-to-markdown",
  {
    pdfUrl: z.string().describe("URL of the PDF to parse"),
  },
  async (params) => {
    console.error(`Parsing PDF from URL: ${params.pdfUrl}`);
    // 这里应该是实际的 PDF 解析逻辑
    // 目前返回模拟数据
    return {
      content: [
        {
          type: "text",
          text: "This is a mock markdown representation of the PDF at ${params.pdfUrl}.\n\n## Company Overview\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Products\n\n- Product 1\n- Product 2\n- Product 3\n\n## Contact Information\n\nEmail: contact@example.com\nPhone: (123) 456-7890",
        },
      ],
    };
  }
);

// 导出服务器实例
export default mcpServer;
