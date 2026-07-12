import { createSession } from "../service-logics/session-config";

export async function newChatCommand() {
  const session = await createSession();
  console.log("NEW SESSION CREATED: ", session.id);
  console.log(JSON.stringify(session, null, 2));
}
