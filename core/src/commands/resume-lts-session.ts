import { getProjectHash, getLatestSession } from "../service-logics/session-config";

export async function resumeLtsSessionCommand() {
  const hash = await getProjectHash(process.cwd());
  const session = await getLatestSession(hash);

  if (!session) {
    console.log("NO SESSIONS FOUND");
    return;
  }

  console.log("RESUMING SESSION: ", session.id);
  console.log(JSON.stringify(session, null, 2));
}
