import { readProjectIndex } from "../service-logics/reads";

export async function lsProjectsCommand() {
  const projects = await readProjectIndex();
  console.log("PROJECTS:", JSON.stringify(projects, null, 2));
}
