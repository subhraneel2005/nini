import { readGlobalConfig, readProjectConfig } from "../service-logics/reads";

export async function showConfigCommand() {
  const global = await readGlobalConfig();
  console.log("GLOBAL CONFIG: ", JSON.stringify(global, null, 2));

  let project;
  try {
    project = await readProjectConfig();
    console.log("PROJECT CONFIG: ", JSON.stringify(project, null, 2));
  } catch {
    console.log("PROJECT CONFIG: (not initialised)");
  }
}
