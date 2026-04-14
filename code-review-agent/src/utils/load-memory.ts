import { readFile } from "fs/promises";

export async function loadMemory() {
  const agent = await readFile(".agent/AGENT.md");
  const project = await readFile(".agent/PROJECT.md");
  const user = await readFile(".agent/USER.md");

  return {
    agent,
    project,
    user,
  };
}
