import { input } from "@inquirer/prompts";
import z from "zod";

export const WriteFileSchema = z.object({
  folder: z
    .string()
    .optional()
    .describe(
      "Optional folder path (relative to project root) where the file should be created.",
    ),

  filename: z
    .string()
    .describe(
      "Name of the file to create including extension (e.g. index.ts, config.json).",
    ),

  fileContent: z
    .string()
    .describe(
      "Full content that should be written into the file. This will overwrite the file if it already exists.",
    ),
});

export const ReadFileSchema = z.object({
  folder: z
    .string()
    .optional()
    .describe(
      "Optional folder path (relative to the project root) where the file is located.",
    ),

  filename: z
    .string()
    .describe(
      "Name of the file to read including extension (e.g. index.ts, package.json).",
    ),
});

export const ReadFileResultSchema = z.union([
  z.object({
    success: z.literal(true),
    fileContent: z
      .string()
      .describe("Full textual content of the requested file."),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);

export const SearchFilesSchema = z.object({
  folder: z.string().optional(),
  pattern: z.string().optional(),
});

export const SearchFilesResultSchema = z.union([
  z.object({
    success: z.literal(true),
    files: z.array(z.string()).describe("List of file paths"),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);

export const EditFileInputSchema = z.object({
  filename: z.string().describe("Name of the file to edit (e.g. 'index.ts')."),
  folder: z
    .string()
    .optional()
    .describe(
      "Optional relative folder path from project root (e.g. 'src/utils'). If omitted, file is assumed to be in root.",
    ),
  oldStr: z.string().describe(
    "Exact or near-exact code snippet currently present in the file that should be replaced. \
        Must include enough surrounding context (multiple lines if possible) to uniquely identify the target location.",
  ),

  newStr: z
    .string()
    .describe(
      "New code snippet that will replace oldStr. Should be a complete, valid replacement block (not partial).",
    ),
  isApproved: z
    .boolean()
    .optional()
    .describe("Needs approval before writing new changes"),
});

export const EditFileOutputSchema = z.union([
  z.object({
    success: z.literal(true),

    path: z
      .string()
      .describe("File path of the file that was successfully modified."),

    preview: z
      .object({
        before: z.string(),
        after: z.string(),
        diff: z.string(),
      })
      .optional(),

    summary: z
      .object({
        additions: z
          .string()
          .describe(
            "Text content that was added to the file (diff-style, may include multiple lines).",
          ),
        deletions: z
          .string()
          .describe(
            "Text content that was removed from the file (diff-style, may include multiple lines).",
          ),
        additionsCount: z
          .number()
          .describe(
            "Number of characters or lines added (depending on implementation). Indicates size of change.",
          ),
        deletionsCount: z
          .number()
          .describe(
            "Number of characters or lines removed. Indicates size of change.",
          ),
      })
      .describe(
        "Summary of changes applied to the file. Useful for understanding impact without reading full diff.",
      ),

    needsApproval: z
      .boolean()
      .optional()
      .describe(
        "Needs human approval to be true for the agent to write the changes in the file",
      ),
  }),

  z.object({
    success: z.literal(false),

    error: z
      .string()
      .describe(
        "Error message explaining why the edit failed (e.g. oldStr not found, invalid path, permission issue).",
      ),
  }),
]);

export const LsInputSchema = z.object({
  propPath: z.string(),
  all: z.boolean(),
});

export const LsOutputSchema = z.union([
  z.object({
    success: z.literal(true),
    files: z
      .string()
      .describe(
        "All the files that are got by the ls tool joined in a single string with new lines",
      ),
  }),

  z.object({
    success: z.literal(false),
    error: z
      .string()
      .describe("Error message explaining why the ls tool failed."),
  }),
]);

export const PwdInputSchema = z.object({
  filename: z
    .string()
    .optional()
    .describe("Pass the filename to this if user tells about filename."),
});

export const PwdOutputSchema = z.union([
  z.object({
    success: z.literal(true),
    pwd: z.string().describe("The present working directory."),
  }),

  z.object({
    success: z.literal(false),
    error: z
      .string()
      .describe("Error message explaining why the ls tool failed."),
  }),
]);

export const GrepInputSchema = z.object({
  pattern: z.string(),
  filename: z.string(),
});

export const GrepOutputSchema = z.union([
  z.object({
    success: z.literal(true),
    matches: z
      .array(z.string())
      .describe("The matches that is got from the pattern search using grep."),
  }),

  z.object({
    success: z.literal(false),
    error: z
      .string()
      .describe("Error message explaining why the grep tool failed."),
  }),
]);

export const GIT_COMMANDS = [
  "push",
  "pull",
  "commit",
  "issue create",
  "issue edit",
  "pr create",
  "pr status",
  "pr list",
  "pr checkout",
  "pr diff",
  "pr edit",
  "pr comment",
  "pr close",
  "pr merge",
] as const;

export const GitToolsInputSchema = z.object({
  command: z.enum(GIT_COMMANDS).describe(`
        The Git/GitHub operation the agent wants to perform.  
        Use this tool whenever the task involves interacting with the repository history, remote origin, or GitHub pull requests/issues.
        
        Available commands:

        commit
        Add (Stage) and Commit the latest changes
        
        push
        Push the current local branch commits to the remote repository.  
        Use after creating commits that should be uploaded to GitHub.
        
        pull
        Fetch and merge changes from the remote repository into the current branch.  
        Use when the agent needs the latest updates from collaborators.
        
        issue create
        Create a new GitHub issue in the repository.  
        Use when the user wants to track a bug, feature request, or task.
        
        issue edit
        Edit an existing GitHub issue (title, description, etc).
        
        pr create
        Create a new pull request from the current branch to the base branch.  
        Use after committing and pushing changes that should be reviewed.
        
        pr status
        Show the current status of pull requests related to the branch.  
        Useful for checking whether a PR already exists.
        
        pr list
        List open pull requests in the repository.
        
        pr checkout
        Checkout a pull request locally so the agent can inspect or modify the code.
        
        pr diff
        Show the code differences introduced by a pull request.
        
        pr edit
        Edit an existing pull request (title or description).
        
        pr comment
        Add a comment to a pull request discussion.
        
        pr close
        Close an open pull request without merging.
        
        pr merge
        Merge a pull request into the base branch after review.
    `),
  commitMessage: z
    .string()
    .optional()
    .describe("The commit message when the command is git commit"),
  title: z
    .string()
    .optional()
    .describe("Title for GitHub issue or pull request"),

  body: z
    .string()
    .optional()
    .describe("Body/description for GitHub issue or pull request"),
});

const TODO_STATUS = ["completed", "not completed", "ongoing"] as const;

export const SingleTodoSchema = z.object({
  id: z.string().describe("Unique id of the todo"),
  todo: z.string().describe("Define the task here"),
  status: z.enum(TODO_STATUS).default("not completed"),
  priority: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe("1 = Highest Priority"),
});

export const TodosSchema = z.object({
  todos: z.array(SingleTodoSchema),
  areAllCompleted: z.boolean().default(false).optional(),
});

export const UpdateTodoStatusSchema = z.object({
  id: z.string(),
  status: z.enum(TODO_STATUS),
  todos: TodosSchema,
});

export const MEMORY_TYPE = ["agent", "project", "user"] as const;

export const WriteMemoryInputSchema = z.object({
  memoryType: z
    .enum(MEMORY_TYPE)
    .describe(
      "Type of memory to store. 'user' = user preferences or habits (e.g. prefers pnpm, prefers TypeScript). 'project' = facts about the current repository or tech stack (e.g. uses Next.js, tests in /tests). 'agent' = lessons learned while working on the project (e.g. avoid editing generated files, build command is pnpm build).",
    ),
  content: z
    .string()
    .describe(
      "Short memory entry to store. Should be concise, stable information useful for future sessions. Prefer short bullet-style sentences and avoid temporary task details.",
    ),
});

export const LANG = [
  "node",
  "bun",
  "python",
  "go",
  "java",
  "rust",
  "unknown",
] as const;

export const RunCommandSchema = z.object({
  command: z
    .string()
    .describe(
      "The executable or program to run. Examples: 'npm', 'pnpm', 'yarn', 'python', 'pip', 'uvicorn', 'go', 'cargo', 'java', 'node'. This should be the base command without arguments.",
    ),
  args: z
    .array(z.string())
    .optional()
    .describe(
      "Arguments passed to the command. Each argument should be a separate string. Example: ['run','dev'] for 'npm run dev'. Do not include the main command here.",
    ),
  cwd: z
    .string()
    .optional()
    .describe(
      "Working directory where the command should run. Use when the project is inside a subfolder (common in monorepos). Example: './frontend', './apps/web', './backend'. If omitted, the command runs in the repository root.",
    ),
});

export const WebSearchInputSchema = z.object({
  searchQuery: z.string().describe("The search query that needs to be searched in the web.")
})

export const WebFetchInputSchema = z.object({
  url: z.httpUrl().describe("A valid HTTP/HTTPS url that needs to be fetched")
})

export const WebFetchOutputSchema = z.union([
  z.object({
    success: z.literal(true),
    response: z.string().describe("This is the valid response came after fetching the url")
  }),
  z.object({
    success: z.literal(false),
    error: z.string().describe("This is the invalid response or error message that came after the fetching of the url failed.")
  }),
])

export type WriteFileProps = z.infer<typeof WriteFileSchema>;
export type ReadFileProps = z.infer<typeof ReadFileSchema>;
export type ReadFileResults = z.infer<typeof ReadFileResultSchema>;
export type SearchFiles = z.infer<typeof SearchFilesSchema>;
export type SearchFilesResult = z.infer<typeof SearchFilesResultSchema>;
export type EditFileInput = z.infer<typeof EditFileInputSchema>;
export type EditFileOutput = z.infer<typeof EditFileOutputSchema>;
export type LsInput = z.infer<typeof LsInputSchema>;
export type LsOutput = z.infer<typeof LsOutputSchema>;
export type PwdInput = z.infer<typeof PwdInputSchema>;
export type PwdOutput = z.infer<typeof PwdOutputSchema>;
export type GrepInput = z.infer<typeof GrepInputSchema>;
export type GrepOutput = z.infer<typeof GrepOutputSchema>;
export type GitCommandInput = z.infer<typeof GitToolsInputSchema>;
export type Todos = z.infer<typeof TodosSchema>;
export type SingleTodo = z.infer<typeof SingleTodoSchema>;
export type UpdateTodoStatus = z.infer<typeof UpdateTodoStatusSchema>;
export type WriteMemory = z.infer<typeof WriteMemoryInputSchema>;
export type Lang = (typeof LANG)[number];
export type RunCommandInput = z.infer<typeof RunCommandSchema>;
export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;
export type WebFetchInput = z.infer<typeof WebFetchInputSchema>;
export type WebFetchOutput = z.infer<typeof WebFetchOutputSchema>;

