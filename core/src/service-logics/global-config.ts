import path from "node:path";
import {
  ProviderEnum,
  type GlobalAgentConfigType,
} from "../types/config-types";
import { getGlobalConfigPath } from "./paths";
import fs from "node:fs/promises";
import { readGlobalConfig } from "./reads";

export async function createGlobalConfig() {
  const config = {
    apiKeys: {
      openrouter: "",
      google: "",
      openai: "",
      exa: "",
    },
    preferences: {
      defaultProvider: ProviderEnum.openrouter,
      defaultModel: "openrouter/free",
    },
  };

  await fs.mkdir(path.dirname(await getGlobalConfigPath()), {
    recursive: true,
  });

  await fs.writeFile(await getGlobalConfigPath(), JSON.stringify(config, null, 2));

  return config;
}

export async function updateGlobalConfig(config: GlobalAgentConfigType) {
  await fs.writeFile(await getGlobalConfigPath(), JSON.stringify(config, null, 2));
}

export async function setApiKey(
  provider: keyof GlobalAgentConfigType["apiKeys"],
  apiKey: string,
) {
  const config = await readGlobalConfig();

  config.apiKeys[provider] = apiKey;

  await updateGlobalConfig(config);
}
