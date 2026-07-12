import { getProjectHash } from "../service-logics/session-config";
import { deleteSession } from "../service-logics/project-config";

export async function deleteSessionCommand(sessionId: string) {
  const hash = await getProjectHash(process.cwd());
  await deleteSession(hash, sessionId);
  console.log("SESSION DELETED: ", sessionId);
}
