import fs from "node:fs/promises";
import path from "path";
import { LsInputSchema, LsOutputSchema, type LsInput, type LsOutput } from "../types/tool-types";
import { tool } from "ai";

async function ls({ propPath, all }: LsInput): Promise<LsOutput> {
  const dirPath = path.resolve(propPath);

  try {
    let files = await fs.readdir(dirPath);
    if (!all) {
      files = files.filter((f: string) => !f.startsWith("."));
    }

    return {
        success: true,
        files: files.join("\n")
    };
  } catch (error: any) {
    return {
        success: false,
        error: `Error reading directory: ${error.message}`
    };
  }
}

export const lsTool = tool({
    description: "The ls tool that lists down either all files including hidden ones or just the non-hidden ones in the current directory based on input schema.",
    inputSchema: LsInputSchema,
    outputSchema: LsOutputSchema,
    execute: ls
})
