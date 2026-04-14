import type { ToolSet } from "ai";
import { writeFileTool } from "./tools/write-file";
import { readFileTool } from "./tools/read-file";
import { searchFilesTool } from "./tools/search-files";
import { editFileTool } from "./tools/edit-file";
import { lsTool } from "./tools/ls";
import { pwdTool } from "./tools/pwd";
import { grepTool } from "./tools/grep";
import { gitTool } from "./tools/git-tools";
import { generatePlanAndTodosTool } from "./sub-agents/planner/planner-agent";
import {
  checkIfAllTodosAreCompletedTool,
  createAllTodosTool,
  createTodoTool,
  getNextPendingTodoTool,
  updateTodoStatusTool,
} from "./tools/planner/todo-actions";
import { writeMemoryTool } from "./tools/memory/write-memory";
import { runCommandTool } from "./tools/run-commands";

export const tools = {
  write_file: writeFileTool,
  read_file: readFileTool,
  search_files: searchFilesTool,
  edit_file: editFileTool,

  ls: lsTool,
  pwd: pwdTool,
  grep: grepTool,

  git_tool: gitTool,

  createTodoTool,
  createAllTodosTool,
  updateTodoStatusTool,
  getNextPendingTodoTool,
  checkIfAllTodosAreCompletedTool,

  write_memory: writeMemoryTool,
  run_command: runCommandTool

} satisfies ToolSet;
