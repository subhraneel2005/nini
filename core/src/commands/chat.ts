import { getProjectHash, getLatestSession, createSession } from "../service-logics/session-config";

export async function chatCommand() {
  const hash = await getProjectHash(process.cwd());
  let session = await getLatestSession(hash);

  if (!session) {
    session = await createSession();
  }

  console.log("RESUMING SESSION: ", session.id);
  console.log(JSON.stringify(session, null, 2));
}
