import path from "node:path";
import { fileExists } from "./check-file-exists";
import type { Lang } from "../types/tool-types";

export async function deteckStack(root: string): Promise<Lang> {

  if (await fileExists(path.join(root, "package.json"))) {
    return "node";
  }

  if (
    (await fileExists(path.join(root, "pyproject.toml"))) ||
    (await fileExists(path.join(root, "requirements.txt")))
  ) {
    return "python";
  }

  if (await fileExists(path.join(root, "Cargo.toml"))) {
    return "rust";
  }

  if (await fileExists(path.join(root, "go.mod"))) {
    return "go";
  }

  return "unknown";
}
