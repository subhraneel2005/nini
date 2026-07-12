import { getProjectHash } from "../service-logics/session-config";
import { getUsage } from "../service-logics/project-config";

export async function showUsageCommand() {
  const hash = await getProjectHash(process.cwd());
  const usage = await getUsage(hash);
  console.log("TOKENS USED: ", usage);
}
