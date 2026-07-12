import { select, input } from "@inquirer/prompts";
import { readProjectConfig, readGlobalConfig } from "../service-logics/reads";
import { updateProjectConfig } from "../service-logics/project-config";
import { ProviderEnum } from "../types/config-types";

export async function changeProviderCommand() {
  const global = await readGlobalConfig();
  const project = await readProjectConfig();

  const setting = await select({
    message: "What do you want to change?",
    choices: [
      { name: "Provider", value: "provider" },
      { name: "Model", value: "model" },
    ],
  });

  if (setting === "provider") {
    const provider = await select({
      message: "Choose provider",
      choices: [
        { name: "OpenRouter", value: ProviderEnum.openrouter },
        { name: "Google", value: ProviderEnum.google },
        { name: "OpenAI", value: ProviderEnum.openai },
      ],
    });

    project.defaultProvider = provider;
  } else {
    const model = await input({
      message: "Enter model name",
      default: global.preferences.defaultModel,
    });

    project.defaultModel = model;
  }

  await updateProjectConfig(project);
  console.log("Project config updated:", JSON.stringify(project, null, 2));
}
