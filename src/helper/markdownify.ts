import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type MarkdownResult = {
  path: string;
  text: string;
};

export class Markdownify {
  private static async _markitdown(
    filePath: string,
    projectRoot: string
  ): Promise<string> {
    const venvPath = path.join(projectRoot, "..", ".venv");
    const markitdownPath = path.join(venvPath, "bin", "markitdown");

    console.log("Looking for markitdown at:", markitdownPath);

    if (!fs.existsSync(markitdownPath)) {
      throw new Error(`markitdown executable not found at ${markitdownPath}`);
    }

    const { stdout, stderr } = await execAsync(
      `source "${venvPath}/bin/activate" && "${markitdownPath}" "${filePath}"`
    );

    if (stderr && !stderr.includes("CropBox missing")) {
      throw new Error(`Error executing command: ${stderr}`);
    }

    return stdout || "";
  }

  private static async saveToTempFile(content: string): Promise<string> {
    const tempOutputPath = path.join(
      os.tmpdir(),
      `markdown_output_${Date.now()}.md`
    );
    fs.writeFileSync(tempOutputPath, content);
    return tempOutputPath;
  }

  static async toMarkdown(fileUrl: string): Promise<MarkdownResult> {
    try {
      // 从 file:// URL 中提取实际路径
      const filePath = decodeURIComponent(fileUrl.replace("file://", ""));

      if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
      }

      const projectRoot = path.resolve(__dirname, "..");
      console.log("Project root:", projectRoot);

      const text = await this._markitdown(filePath, projectRoot);

      if (!text.trim()) {
        throw new Error("No content was extracted from the PDF");
      }

      const outputPath = await this.saveToTempFile(text);
      console.log("Markdown saved to:", outputPath);

      return { path: outputPath, text };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Error processing to Markdown: ${e.message}`);
      } else {
        throw new Error("Error processing to Markdown: Unknown error occurred");
      }
    }
  }

  static async get(filePath: string): Promise<MarkdownResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const text = await fs.promises.readFile(filePath, "utf-8");

    return {
      path: filePath,
      text: text,
    };
  }
}
