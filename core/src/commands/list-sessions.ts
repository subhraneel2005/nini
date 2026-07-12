import { getProjectHash } from "../service-logics/session-config";
import { listSessions } from "../service-logics/project-config";

export async function listSessionsCommand() {
  const hash = await getProjectHash(process.cwd());
  const sessions = await listSessions(hash);

  if (sessions.length === 0) {
    console.log("NO SESSIONS FOUND");
    return;
  }

  console.log("SESSIONS: ", JSON.stringify(sessions, null, 2));
}
