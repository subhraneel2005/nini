import fs from "node:fs/promises";
import path from "node:path";
import {
  readGlobalConfig,
  readProjectIndex,
} from "./reads";
import {
  getProjectConfigPath,
  getProjectsIndexPath,
  getSessionConfigPath,
  getSessionsDirPath,
} from "./paths";
import {
  SessionConfig,
  type MessageType,
  type ProjectConfigType,
  type ProjectIndexType,
  type SessionConfigType,
} from "../types/config-types";
import { getLatestSession, updateSession } from "./session-config";

export async function createProjectConfig() {
  const global = await readGlobalConfig();

  const config = {
    defaultProvider: global.preferences.defaultProvider,
    defaultModel: global.preferences.defaultModel,
  };

  await fs.mkdir(path.dirname(getProjectConfigPath()), {
    recursive: true,
  });

  await fs.writeFile(getProjectConfigPath(), JSON.stringify(config, null, 2));

  return config;
}

export async function updateProjectConfig(config: ProjectConfigType) {
  await fs.writeFile(getProjectConfigPath(), JSON.stringify(config, null, 2));
}

export async function getUsage(projectHash: string) {
  const session = await getLatestSession(projectHash);

  return session?.tokenUsed ?? 0;
}

export async function projectExists(projectHash: string) {
  const projects = await readProjectIndex();

  return projectHash in projects;
}

export async function writeProjectIndex(projectIndex: ProjectIndexType) {
  const projectIndexPath = getProjectsIndexPath();

  await fs.mkdir(path.dirname(projectIndexPath), {
    recursive: true,
  });

  await fs.writeFile(projectIndexPath, JSON.stringify(projectIndex, null, 2));
}

export async function createProjectIndexEntry(
  projectHash: string,
  projectPath: string,
) {
  const projects = await readProjectIndex();

  projects[projectHash] = {
    projectPath,
    lastOpened: new Date().toISOString(),
  };

  await writeProjectIndex(projects);
}

export async function listSessions(
  projectHash: string,
): Promise<SessionConfigType[]> {
  const dir = getSessionsDirPath(projectHash);

  try {
    const files = await fs.readdir(dir);

    const sessions = await Promise.all(
      files.map(async (file) => {
        const raw = await fs.readFile(path.join(dir, file), "utf8");

        return SessionConfig.parse(JSON.parse(raw));
      }),
    );

    return sessions.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch {
    return [];
  }
}

export async function deleteSession(projectHash: string, sessionId: string) {
  await fs.unlink(getSessionConfigPath(projectHash, sessionId));
}

export async function appendMessage(
  session: SessionConfigType,
  message: MessageType,
) {
  session.messages.push(message);
  session.updatedAt = new Date().toISOString();

  await updateSession(session);
}

export async function incrementTokenUsage(
  session: SessionConfigType,
  tokens: number,
) {
  session.tokenUsed += tokens;
  session.updatedAt = new Date().toISOString();

  await updateSession(session);
}
