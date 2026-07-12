import path from "node:path";
import fs from "fs/promises";
import { createGlobalConfig } from "../service-logics/global-config";
import { getGlobalConfigPath, getProjectConfigPath } from "../service-logics/paths";
import {
  createProjectConfig,
  createProjectIndexEntry,
  projectExists,
} from "../service-logics/project-config";
import { readGlobalConfig, readProjectConfig } from "../service-logics/reads";
import { getProjectHash } from "../service-logics/session-config";

export async function initCommand() {
  const globalPath = await getGlobalConfigPath();

  // create global config & global path if not exists
  try {
    await fs.access(globalPath);
  } catch (error) {
    await createGlobalConfig();
  }

  const global = await readGlobalConfig();

  // creating project config if not exists
  const projectPath = getProjectConfigPath();

  try {
    await fs.access(projectPath)
  } catch (error) {
    await createProjectConfig()
  }

  const project = await readProjectConfig()

  // creating project entry as hash in index if not exists
  const hash = await getProjectHash(globalPath);

  if (!(await projectExists(hash))) {
    await createProjectIndexEntry(hash, process.cwd());
  }

  console.log("Project Initialised 🚀")
  console.log("Global config: ",JSON.stringify(global))
  console.log("Project config: ",JSON.stringify(project))
}
