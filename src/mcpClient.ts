import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

let client: Client | null = null;
let transport: StdioClientTransport | null = null;

async function createClient() {
  if (!client || !transport) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    console.log("__dirname", path.join(__dirname, "server.js"));

    transport = new StdioClientTransport({
      command: "node",
      args: [path.join(__dirname, "index.js")],
    });

    client = new Client({
      name: "media_kit_mcp",
      version: "1.3.0",
    });

    transport.onclose = () => {
      client = null;
      transport = null;
    };

    await client.connect(transport);
  }

  return client;
}

export default createClient;
