import { spawn } from "child_process";
import { RunCommandSchema, type RunCommandInput } from "../types/tool-types";
import { tool } from "ai";

export async function runCommand({ command, args = [], cwd }: RunCommandInput) {
  return new Promise<{ stdout: string; stderr: string; code: number | null }>(
    (resolve) => {
      const root = process.cwd();
      const workingDir = cwd || root;

      let stdout = "";
      let stderr = "";

      const p = spawn(command, args, {
        cwd: workingDir,
        shell: true,
      });

      p.stdout.on("data", (d) => {
        stdout += d.toString();
      });

      p.stderr.on("data", (d) => {
        stderr += d.toString();
      });

      p.on("close", (code) => {
        resolve({ stdout, stderr, code });
      });
    },
  );
}

export const runCommandTool = tool({
  description: "Execute a shell command inside the repository. Use this to run installs, start development servers, build projects, or run tests. The command should be the base executable (e.g., 'npm', 'python', 'go', 'cargo') and arguments should be passed separately in the args array (e.g., ['run','dev']). If the project is inside a subfolder (common in monorepos), provide the cwd field to run the command from that directory. This tool returns stdout, stderr, and the exit code so you can analyze errors and decide the next action.",
  inputSchema: RunCommandSchema,
  execute: runCommand,
});
