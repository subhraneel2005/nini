<img width="1600" height="542" alt="Untitled design (34) (1)" src="https://github.com/user-attachments/assets/b5ab6787-bbdd-418c-917d-db002a5ae00d" />

<div align="center">

# Tiny AI Coding Agent 

<p>
  <a href="https://github.com/subhraneel2005/sidequests">
    <img src="https://img.shields.io/github/stars/subhraneel2005/sidequests?style=flat&color=FFD700" alt="stars">
  </a>
  <a href="https://github.com/subhraneel2005/sidequests/issues">
    <img src="https://img.shields.io/github/issues/subhraneel2005/sidequests" alt="issues">
  </a>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/gemini2.5-flash-4285F4?style=flat&logo=google&logoColor=white" alt="Google Gemini" />
</p>

</div>

A CLI-based AI coding companion im building from scratch while reverse engineering claude-code/opencode/codex.

---

## Features

### Core Architecture

| Feature | Description |
|---------|-------------|
| Tool-Calling Architecture | Dynamic filesystem and bash tool invocation for autonomous code navigation |
| Core Agent Loop | Streamed responses, multi-step reasoning, and token usage tracking |
| Human-in-the-Loop Approval | Diff display before applying edits to prevent destructive actions |
| Path Traversal Protection | Ensures agent cannot operate outside the project root directory |

---

### Git Tools
* commit - Stage and commit changes with message
* push - Push to remote
* pull - Pull from remote
* issue create - Create new issue
* issue edit - Edit existing issue
* pr checkout - Checkout PR branch
* pr close - Close PR
* pr comment - Comment on PR
* pr create - Create new PR
* pr diff - Show PR diff
* pr edit - Edit PR
* pr list - List PRs
* pr merge - Merge PR
* pr status - Show PR status


---

### Filesystem Tools

- Read - Read file contents
- Search - Search files by pattern
- Write - Write new files
- Edit - Edit existing files with typed I/O, diff based editing and safe failure handling

### Bash Tools

- ls - List directory contents
- pwd - Print working directory
- grep - Search file contents

---

### Planner Sub-Agent

| Tool | Description |
|------|-------------|
| createTodoTool | Create new todo |
| createAllTodosTool | Create multiple todos |
| updateTodoStatusTool | Update todo status |
| getNextPendingTodoTool | Get next pending todo |
| checkIfAllTodosAreCompletedTool | Check if all todos completed |

---

## Upcoming Features

- Memory for better context
- Token usage screen
- Run/build/execute .py/.js/.ts code
- Voice mode (maybe)
- Task completion notifier (maybe)

---

## Initial breakdowns
<img width="1197" height="659" alt="image" src="https://github.com/user-attachments/assets/05ff4ac9-d1e4-4718-9b33-f9dcec0ed0bf" />
