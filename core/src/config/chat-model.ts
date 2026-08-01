import type { LanguageModel } from "ai";
import { openrouter } from "./openrouter";
import { google } from "@ai-sdk/google";
import { ProviderEnum } from "../types/config-types";

export function chatModel(provider: ProviderEnum, modelId: string): LanguageModel {
  switch (provider) {
    case ProviderEnum.google:
      return google.chat(modelId);
    case ProviderEnum.openai:
      throw new Error(
        "OpenAI provider is not installed. Add @ai-sdk/openai or switch provider.",
      );
    case ProviderEnum.openrouter:
    default:
      return openrouter.chat(modelId);
  }
}
