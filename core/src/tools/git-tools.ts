import { exec } from "child_process";
import { promisify } from "util"
import type { GitCommandInput } from "../types/tool-types";
import {GitToolsInputSchema} from "../types/tool-types"
import { tool } from "ai";

const execAsync = promisify(exec)

async function gitToolFunc({ command, commitMessage, title, body }: GitCommandInput) {
  let cmd = "";
  switch (command) {
    case "commit":
        cmd = `git add . && git commit -m "${commitMessage}"`
        break
    case "push":
      cmd = "git push";
      break;
    case "pull":
      cmd = "git pull";
      break;
    case "issue create":
      cmd = `gh issue create --title "${title}" --body "${body}"`
      break
    case "issue edit":
      cmd = `gh issue edit --title "${title}" --body "${body}"`
      break;
    case "pr checkout":
      cmd = "gh pr checkout";
      break;
    case "pr close":
      cmd = "gh pr close";
      break;
    case "pr comment":
      cmd = `gh pr comment --body "${body}"`;
      break;
    case "pr create":
      cmd = `gh pr create --title "${title}" --body "${body}"`
      break;
    case "pr diff":
      cmd = "gh pr diff";
      break;
    case "pr edit":
      cmd = `gh pr edit --title "${title}" --body "${body}"`;
      break;
    case "pr list":
      cmd = "gh pr list";
      break;
    case "pr merge":
      cmd = "gh pr merge";
      break;
    case "pr status":
      cmd = "gh pr status";
      break;
    default:
      throw new Error("Unsupported git command");
  }
  try {
    const {stdout, stderr} = await execAsync(cmd)

    return stderr || {stdout, message: "command executed successfully"}
  } catch (error: any) {
    const message =
    error?.stderr ||
    error?.stdout ||
    error?.message ||
    "Unknown git command failure"

  console.error("Git tool execution failed")
  console.error("Command:", cmd)
  console.error("Error:", message)

  throw new Error(`Git command failed: ${message}`)
  }
}

export const gitTool = tool({
    description: "The git tool gives you access to github (gh) cli commands to execute in the command line. Use when needed.",
    inputSchema: GitToolsInputSchema,
    execute: gitToolFunc
})
