# 解析 Media Kit pdf 文件

## 使用方法

```bash
npm install

npm run build
```

## 集成 MCP 到 MCP HOST

```json
{
  "mcpServers": {
    "media-kit-mcp": {
      "command": "node",
      "args": ["YOUR_MEDIA_KIT_MCP_SERVER_INDEX_FILE_ABSOLUTE_PATH"],
      "env": {
        "DEEP_SEEK_API_KEY": "YOUR_DEEP_SEEK_API_KEY"
      },
      "transport": "stdio",
      "enabled": true,
      "description": "用于解析广告营销行业跟不同资源联动时 Media Kit pdf 文件的关键内容"
    }
  }
}
```
