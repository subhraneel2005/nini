import { access } from "fs/promises";

export async function fileExists(filePath: string) {
    try {
      await access(filePath)
      return true
    } catch {
      return false
    }
  }