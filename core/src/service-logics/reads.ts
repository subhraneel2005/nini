// reads/returns the content of the config json(s)

import {
  GlobalAgentConfig,
  ProjectConfig,
  ProjectIndex,
  SessionConfig,
  type GlobalAgentConfigType,
  type ProjectConfigType,
  type ProjectIndexType,
  type SessionConfigType,
} from "../types/config-types";
import fs from "node:fs/promises";
import {
  getGlobalConfigPath,
  getProjectConfigPath,
  getProjectsIndexPath,
  getSessionConfigPath,
} from "./paths";

export async function readGlobalConfig(): Promise<GlobalAgentConfigType> {
  const raw = await fs.readFile(await getGlobalConfigPath(), "utf8");
  return GlobalAgentConfig.parse(JSON.parse(raw));
}

export async function readProjectConfig(): Promise<ProjectConfigType> {
  const raw = await fs.readFile(getProjectConfigPath(), "utf8");
  return ProjectConfig.parse(JSON.parse(raw));
}

export async function readSessionConfig(
  projectHash: string,
  sessionId: string,
): Promise<SessionConfigType> {
  const raw = await fs.readFile(
    getSessionConfigPath(projectHash, sessionId),
    "utf8",
  );
  return SessionConfig.parse(JSON.parse(raw));
}

export async function readProjectsIndexConfig(): Promise<ProjectIndexType> {
  const raw = await fs.readFile(getProjectsIndexPath(), "utf8");
  return ProjectIndex.parse(JSON.parse(raw));
}

export async function readProjectIndex(): Promise<ProjectIndexType> {
  try {
    const raw = await fs.readFile(
      getProjectsIndexPath(),
      "utf8"
    );

    return ProjectIndex.parse(JSON.parse(raw));
  } catch {
    // First run: projects.json doesn't exist yet
    return {};
  }
}
