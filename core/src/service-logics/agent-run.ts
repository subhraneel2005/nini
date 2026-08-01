import { createCodingAgent } from "../index";
import { appendMessage, incrementTokenUsage } from "./project-config";
import type { ModelMessage } from "ai";
import type { MessageType, SessionConfigType } from "../types/config-types";

export interface AgentTurnCallbacks {
  onAssistantDelta: (delta: string, full: string) => void;
  onAssistantDone: (full: string) => void;
  onToolCall: (event: {
    toolCallId: string;
    toolName: string;
    input: unknown;
  }) => void;
  onToolResult: (event: {
    toolCallId: string;
    toolName: string;
    output: unknown;
  }) => void;
  onToolError: (event: {
    toolCallId: string;
    toolName: string;
    error: unknown;
  }) => void;
  onError: (error: unknown) => void;
  onTokenUsage: (totalTokens: number) => void;
}

const now = () => new Date().toISOString();

export async function runAgentTurn(
  session: SessionConfigType,
  userPrompt: string,
  callbacks: AgentTurnCallbacks,
) {
  // Session tool messages are display-only strings; the AI SDK requires
  // structured tool-result parts, so filter them out of the history.
  const history: ModelMessage[] = session.messages
    .filter((m) => m.role !== "tool")
    .map((m) => ({ role: m.role, content: m.content }) as ModelMessage);

  const agent = createCodingAgent(session.provider, session.model);

  const result = await agent.stream({
    messages: [...history, { role: "user", content: userPrompt }],
  });

  const persist = async (role: MessageType["role"], content: string) => {
    await appendMessage(session, { role, content, timestamp: now() });
  };

  let assistantText = "";

  for await (const chunk of result.fullStream) {
    switch (chunk.type) {
      case "text-delta":
        assistantText += chunk.text;
        callbacks.onAssistantDelta(chunk.text, assistantText);
        break;

      case "tool-call":
        await persist("tool", `[call] ${chunk.toolName}`);
        callbacks.onToolCall({
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          input: chunk.input,
        });
        break;

      case "tool-result":
        await persist("tool", `[done] ${chunk.toolName}`);
        callbacks.onToolResult({
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          output: chunk.output,
        });
        break;

      case "tool-error":
        await persist("tool", `[error] ${chunk.toolName}`);
        callbacks.onToolError({
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          error: chunk.error,
        });
        break;

      case "error": {
        const message =
          chunk.error instanceof Error ? chunk.error.message : String(chunk.error);
        await persist("system", `Agent error: ${message}`);
        callbacks.onError(chunk.error);
        break;
      }

      case "finish":
        if (chunk.totalUsage.totalTokens != null) {
          callbacks.onTokenUsage(chunk.totalUsage.totalTokens);
          await incrementTokenUsage(session, chunk.totalUsage.totalTokens);
        }
        break;
    }
  }

  if (assistantText.length > 0) {
    await persist("assistant", assistantText);
    callbacks.onAssistantDone(assistantText);
  }
}
