import { glob } from "glob"
import { SearchFilesResultSchema, SearchFilesSchema, type SearchFiles, type SearchFilesResult } from "../types/tool-types";
import path from "path"
import { tool } from "ai";

async function searchFiles({ folder, pattern }: SearchFiles): Promise<SearchFilesResult> {

    const root = process.cwd()

    const basePath = folder
        ? path.resolve(root, folder)
        : root

    if (!basePath.startsWith(root)) {
        throw new Error("Invalid folder path")
    }

    try {
        // A bare name/pattern like "*registry*" only matches the current dir,
        // so make it recursive so nested files (e.g. src/tools-registry.ts) match too.
        const normalizedPattern = pattern && !pattern.includes("/")
            ? `**/${pattern}`
            : pattern || "**/*";

        const files = await glob(normalizedPattern, { cwd: basePath, ignore: ["node_modules/**", ".git/**", "dist"] });

        const fullPaths = files.map((file) => path.join(basePath, file))

        return {
            success: true,
            files: fullPaths
        };
    } catch (err: any) {
        console.error('Error searching for files:', err);

        return {
            success: false,
            error: String(err)
        }
    }
}

export const searchFilesTool = tool({
    description: "Search for files in the project using a glob pattern. The search is recursive and includes all subdirectories, so a name like \"registry\" will match src/tools-registry.ts. Optionally specify a folder path relative to the project root to limit the search scope; otherwise, the entire project is searched. Returns a list of matching file paths.",
    inputSchema: SearchFilesSchema,
    outputSchema: SearchFilesResultSchema,
    execute: searchFiles
})

// searchFiles({
//     pattern: "**/tools/**/*.ts"
// })