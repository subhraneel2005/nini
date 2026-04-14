import { tool } from "ai";
import {
  WriteMemoryInputSchema,
  type WriteMemory,
} from "../../types/tool-types";
import { appendToFile, writeFileWithContent } from "../write-file";

async function writeMemory({ memoryType, content }: WriteMemory) {
  const fileMap = {
    agent: "AGENT.md",
    project: "PROJECT.md",
    user: "USER.md",
  };
  try {
    await appendToFile({
      folder: ".agent",
      filename: fileMap[memoryType],
      fileContent: `${content}`,
    });
  } catch (error) {
    console.error("error at write memory", error);
  }
}

export const writeMemoryTool = tool({
  description: `Store useful long-term information in persistent memory.

Memory types:
- user: user preferences
- project: facts about the repository
- agent: lessons learned while working

Only store stable information that will be useful in future sessions.
`,
  inputSchema: WriteMemoryInputSchema,
  execute: writeMemory,
});
