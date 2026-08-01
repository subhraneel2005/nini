import { render } from "ink";
import { getProjectHash, getLatestSession, createSession } from "../service-logics/session-config";
import Chat from "../components/Chat.js"
import React from "react";

export async function chatCommand() {
  const hash = await getProjectHash(process.cwd());
  let session = await getLatestSession(hash);

  if (!session) {
    session = await createSession();
  }

  const chatDetails = session.messages.map((m,idx) => ({
    id: idx,
    role: m.role,
    content: m.content
  }))

  render(
    React.createElement(Chat, {
      initMessages: chatDetails,
      session: session
    })
  )
}
