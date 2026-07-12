import { getProjectHash } from "../service-logics/session-config";
import { readSessionConfig } from "../service-logics/reads";

export async function resumeSpecificSessionCommand(sessionId: string) {
  const hash = await getProjectHash(process.cwd());
  const session = await readSessionConfig(hash, sessionId);
  console.log("SESSION:", JSON.stringify(session, null, 2));
}
