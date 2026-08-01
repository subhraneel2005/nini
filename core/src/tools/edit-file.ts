import fs from "node:fs/promises"
import { diffChars, diffLines } from "diff"
import path from "path"
import "colors"
import { EditFileInputSchema, EditFileOutputSchema, type EditFileInput, type EditFileOutput } from "../types/tool-types"
import { tool } from "ai"


export async function editFile({ filename, folder, newStr, oldStr, isApproved }: EditFileInput): Promise<EditFileOutput> {

    const root = process.cwd();
    const basePath = folder ? path.join(root, folder) : root;

    if (!basePath.startsWith(root)) {
        throw new Error("Invalid folder path")
    }

    const filePath = path.join(basePath, filename);

    const oldFileContent = await fs.readFile(filePath, "utf-8")

    if (!oldFileContent.includes(oldStr)) {
        return { success: false, error: "oldStr not found" }
    }

    const newFileContent = oldFileContent.replace(oldStr, newStr)

    const diff = diffLines(oldFileContent, newFileContent)

    let additions = "";
    let deletions = "";

    let additionsCount = 0;
    let deletionsCount = 0;

    let coloredDiff = "";

    const preview = {
        before: oldStr,
        after: newStr,
        diff: coloredDiff
    }

    diff.forEach((part) => {
        let text = part.added ? part.value.bgGreen : part.removed ? part.value.bgRed : part.value

        if (part.added) additionsCount += part.value.length
        if (part.removed) deletionsCount += part.value.length

        if (part.added) additions += part.value
        if (part.removed) deletions += part.value

        coloredDiff += text;
    })

    // needs human approval before writing the incoming changes into the file
    if (!isApproved) {
        return {
            success: true,
            path: filePath,
            preview,
            summary: { additions, deletions, additionsCount, deletionsCount },
            needsApproval: true
        }
    }

    await fs.writeFile(filePath, newFileContent)

    return {
        success: true,
        path: filePath,
        summary: {
            additions,
            deletions,
            additionsCount,
            deletionsCount
        }
    }
}

export const editFileTool = tool({
    description: "Replace a specific code block in a file by matching oldStr and substituting it with newStr. Requires precise context to ensure a unique and safe edit.",
    inputSchema: EditFileInputSchema,
    outputSchema: EditFileOutputSchema,
    execute: editFile
})
