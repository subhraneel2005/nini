import { ReadFileResultSchema, ReadFileSchema, type ReadFileProps, type ReadFileResults } from "../types/tool-types";
import path from "node:path"
import fs from "node:fs/promises"
import { tool } from "ai";

async function readFile({ folder, filename }: ReadFileProps): Promise<ReadFileResults> {

    const root = process.cwd();
    const basePath = folder ? path.join(root, folder) : root;

    const filePath = path.join(basePath, filename);

    if (!basePath.startsWith(root)) {
        throw new Error("Invalid folder path")
    }

    if (!filePath.startsWith(root)) {
        throw new Error("Path traversal detected")
    }

    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
        throw new Error("Expected a file but got a directory")
    }

    // console.log(`file size: ${stat.size / 1024} kb`)

    try {
        const data = await fs.readFile(filePath, { encoding: "utf8" })

        return {
            success: true,
            fileContent: data
        }

    } catch (error: any) {
        if (error.code === "ENOENT") {
            return { success: false, error: "File does not exist" }
        }
        console.error("Error at tool: read_file: " + error)
        return { success: false, error: String(error) }
    }
}

export const readFileTool = tool({
    description: "Read the contents of a file inside the project directory. Optionally specify a folder path relative to the project root where the file is located. Returns the full textual content of the file if it exists.",
    inputSchema: ReadFileSchema,
    outputSchema: ReadFileResultSchema,
    execute: readFile
})

// readFile({
//     folder: "src/rag-actions",
//     filename: "embed-file.ts"
// })