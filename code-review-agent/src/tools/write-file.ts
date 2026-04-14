import fs from "node:fs/promises"
import path from "node:path"
import { WriteFileSchema, type WriteFileProps } from "../types/tool-types";
import { tool } from "ai";

export async function writeFileWithContent({ filename, fileContent, folder }: WriteFileProps) {

    const basePath = folder ? path.join(process.cwd(), folder) : process.cwd()

    const filePath = path.join(basePath, filename);

    if (!basePath.startsWith(process.cwd())) {
        throw new Error("Invalid folder path")
    }

    try {
        await fs.mkdir(basePath, { recursive: true })
        await fs.writeFile(filePath, fileContent)
        console.debug("file created: " + filePath)

        return { sucess: true, path: filePath }
    } catch (error) {
        console.error("Error at tool: write_file: " + error)
        return { success: false, error: String(error) }
    }
}

export async function appendToFile({ filename, fileContent, folder }: WriteFileProps) {

    const basePath = folder ? path.join(process.cwd(), folder) : process.cwd()
    const filePath = path.join(basePath, filename)

    if (!basePath.startsWith(process.cwd())) {
        throw new Error("Invalid folder path")
    }

    try {
        await fs.mkdir(basePath, { recursive: true })

        await fs.appendFile(filePath, fileContent + "\n")

        console.debug("content appended: " + filePath)

        return { success: true, path: filePath }

    } catch (error) {
        console.error("Error at append_file: " + error)
        return { success: false, error: String(error) }
    }
}   

export const writeFileTool = tool({
    description: "Create or overwrite a file with given content inside the project directory. Optionally specify a folder path relative to the project root. Any missing folders will be created automatically.",
    inputSchema: WriteFileSchema,
    execute: writeFileWithContent
})



// usage:
// writeFileWithContent({
//     folder: "src/tests",
//     filename: "tool.test.js",
//     fileContent: "kya re?",
// })