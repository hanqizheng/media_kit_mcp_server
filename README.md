# Media Kit MCP Server

[certified by MCP Review](https://mcphub.com/mcp-servers/hanqizheng/media_kit_mcp_server)

## Overview

**Media Kit MCP Server** is a service designed to parse and analyze Media Kit PDF files, commonly used in the advertising and marketing industry. It extracts key information from PDF files, converts them to Markdown, and leverages AI (DeepSeek API) for comprehensive content analysis, including audience demographics, pricing, and marketing insights. The server is built to be integrated as a plugin for MCP (Model Context Protocol) hosts, supporting both stdio and HTTP API modes.

---

## Features

- **PDF to Markdown Conversion**: Automatically extracts and converts local PDF files to Markdown text.
- **AI-Powered Content Analysis**: Uses DeepSeek API to analyze media kit content, providing structured insights (audience, packages, reach, etc.).
- **MCP Protocol Support**: Implements the MCP server protocol for easy integration with MCP hosts via stdio.
- **Optional RESTful API**: Offers an HTTP API for frontend or third-party integration.
- **TypeScript & Type Safety**: Written in TypeScript with clear type definitions for maintainability.
- **Testing**: Includes integration and API tests for reliability.
- **Simple Web UI**: (Optional) A basic HTML page for local testing of the HTTP API.

---

## Directory Structure

```
media_kit_mcp_server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── server.ts             # MCP server logic and tool registration
│   ├── nodeServer.ts         # Optional HTTP API server
│   ├── mcpClient.ts          # MCP client for local API calls
│   ├── helper/
│   │   ├── markdownify.ts    # PDF-to-Markdown utility
│   │   └── deepseek.ts       # DeepSeek AI analysis utility
│   ├── type/
│   │   ├── common.ts         # Common type definitions
│   │   └── mediaKit.ts       # Media Kit structure types
│   ├── test/
│   │   ├── comprehensive.test.ts # Integration test
│   │   └── deepseek.test.ts      # DeepSeek API test
│   └── index.html            # Simple web UI for HTTP API
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Run as MCP Server (Recommended)

Integrate this project as an MCP plugin in your MCP HOST configuration:

```json
{
  "mcpServers": {
    "media-kit-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "DEEP_SEEK_API_KEY": "YOUR_DEEP_SEEK_API_KEY"
      },
      "transport": "stdio",
      "enabled": true,
      "description": "Parse and analyze Media Kit PDF files for advertising and marketing use cases"
    }
  }
}
```

### 4. Run as HTTP API (Optional)

To use the HTTP API (for frontend or third-party integration):

```bash
npm run build
node dist/nodeServer.js
```

The server will listen on port `3000` by default. You can test it with the included `src/index.html` page or via API calls.

---

## MCP Tools

### parse-pdf-to-markdown

- **Description**: Convert a local PDF file (file://) to Markdown text.
- **Parameters Schema**:
  ```json
  {
    "pdfUrl": "file:///absolute/path/to/file.pdf"
  }
  ```
- **Returns Schema**:
  ```json
  {
    "content": [
      {
        "type": "text",
        "text": "Extracted markdown content..."
      }
    ],
    "error": "Error message if any error occurred."
  }
  ```

### analyze-media-kit

- **Description**: Analyze media kit Markdown content and return structured insights (audience, pricing, etc.)
- **Parameters Schema**:
  ```json
  {
    "markdown": "# Media Kit\n..."
  }
  ```
- **Returns Schema**:
  ```json
  {
    "content": [
      {
        "type": "text",
        "text": "{ \"basicInfo\": { ... }, \"analysis\": { ... } }"
      }
    ],
    "error": "Error message if any error occurred."
  }
  ```

---

## HTTP API Reference

- **POST /analyze**
  - **Body**: `{ pdfUrl: "file:///absolute/path/to/file.pdf" }`
  - **Response**: JSON analysis result

---

## Dependencies

- Node.js 18+
- TypeScript
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- [DeepSeek API](https://deepseek.com/) (requires `DEEP_SEEK_API_KEY` environment variable)
- markitdown (for PDF-to-Markdown, requires local Python virtual environment and markitdown tool)

---

## Development & Testing

### Run Tests

```bash
# Integration test
ts-node src/test/comprehensive.test.ts

# DeepSeek API test
ts-node src/test/deepseek.test.ts
```

### Code Structure

- `src/helper/markdownify.ts`: Invokes the local markitdown tool to convert PDFs to Markdown.
- `src/helper/deepseek.ts`: Wraps DeepSeek API for content analysis.
- `src/server.ts`: Registers MCP tools and handles requests.
- `src/nodeServer.ts`: Provides an HTTP API for external integration.
- `src/index.html`: Simple web UI for local testing of the HTTP API.

---

## Common Issues

- **markitdown not found?**

  - Ensure you have a Python virtual environment with markitdown installed at `.venv/bin/markitdown` in the parent directory of your project root.

- **DeepSeek API Key missing?**
  - Set the `DEEP_SEEK_API_KEY` environment variable before running the server.

---

## License

This project is licensed under the **ISC** License.

---

## Contributing

Contributions, issues, and feature requests are welcome! Please open an issue or submit a pull request.
