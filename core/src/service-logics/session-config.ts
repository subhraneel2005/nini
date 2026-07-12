// getProjectHash (hash using cwd)
// createSession
// getLatestSession using projectHash
import crypto from "node:crypto";
import { SessionConfig, type SessionConfigType } from "../types/config-types";
import { getSessionConfigPath, getSessionsDirPath } from "./paths";
import { readProjectConfig } from "./reads";
import fs from "node:fs/promises";
import path from "node:path";

export async function getProjectHash(projectPath: string) {
  return crypto
    .createHash("sha256")
    .update(projectPath)
    .digest("hex")
    .slice(0, 6);
}


export async function createSession() {
  const projectHash = await getProjectHash(process.cwd());
  const sessionId = crypto.randomUUID();
  const { defaultModel, defaultProvider } = await readProjectConfig();

  const session: SessionConfigType = {
    id: sessionId,
    projectHash,
    model: defaultModel,
    provider: defaultProvider,
    tokenUsed: 0,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sessionPath = await getSessionConfigPath(projectHash, sessionId);

  await fs.mkdir(path.dirname(sessionPath), {
    recursive: true,
  });

  await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));

  return session;
}

export async function getLatestSession(
  projectHash: string,
): Promise<SessionConfigType | null> {
  const sessionDirPath = await getSessionsDirPath(projectHash);
  const allFiles = await fs.readdir(sessionDirPath);

  let latestFile = allFiles[0];
  let latestMtime = 0;

  if (allFiles.length === 0) {
    return null;
  }

  for (const file of allFiles){
    const filePath = path.join(sessionDirPath, file)
    const stat = await fs.stat(filePath)

    if(stat.mtimeMs > latestMtime){
        latestFile = file
        latestMtime = stat.mtimeMs
    }
  }

  const raw = await fs.readFile(path.join(sessionDirPath, latestFile!), "utf8")

  return SessionConfig.parse(JSON.parse(raw))
}

export async function updateSession(session: SessionConfigType) {
    session.updatedAt = new Date().toISOString();
  
    await fs.writeFile(
      await getSessionConfigPath(session.projectHash, session.id),
      JSON.stringify(session, null, 2)
    );
  }
