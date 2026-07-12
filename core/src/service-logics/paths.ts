// return config paths

import path from "node:path";
import os from "node:os";

const HOME_DIR = os.homedir();

export async function getGlobalConfigPath() {
  return path.join(HOME_DIR, ".config", "nini", "config.json");
}

export function getProjectConfigPath() {
  return path.join(process.cwd(), ".nini", "config.json");
}

export function getProjectsIndexPath() {
  return path.join(
    HOME_DIR,
    ".config",
    "nini",
    "projects.json"
  );
}

export function getSessionConfigPath(projectHash: string, sessionId: string) {
  return path.join(
    HOME_DIR,
    ".config",
    "nini",
    "sessions",
    projectHash,
    `${sessionId}.json`,
  );
}

export function getSessionsDirPath(projectHash: string){
  return path.join(
    HOME_DIR,
    ".config",
    "nini",
    "sessions",
    projectHash,
  );
}