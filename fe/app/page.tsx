"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Terminal,
  GitBranch,
  FolderOpen,
  TerminalWindow,
  Robot,
  ArrowRight,
  GithubLogo,
  BookOpen,
  Warning,
  Users,
} from "@phosphor-icons/react"

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "20+", label: "tools" },
  { value: "4", label: "architecture layers" },
  { value: "4", label: "roadmap phases" },
  { value: "open", label: "source" },
]

const howItWorks = [
  { step: "01", title: "Describe a task", desc: "Tell the agent what you want to build, fix, or refactor in plain English." },
  { step: "02", title: "Agent plans & explores", desc: "It reads your codebase, searches relevant files, and builds a plan." },
  { step: "03", title: "Executes with tools", desc: "Reads, writes, edits files and runs commands — all autonomous." },
  { step: "04", title: "You review & approve", desc: "Diffs are shown before any change is applied. You stay in control." },
]

const coreFeatures = [
  {
    title: "Tool-Calling Architecture",
    desc: "Dynamic filesystem and bash tool invocation for autonomous code navigation.",
    items: ["Read, write, edit files through typed tool interfaces", "Execute bash commands with output streaming", "Pluggable tool registry for extensibility"],
  },
  {
    title: "Core Agent Loop",
    desc: "Streamed responses, multi-step reasoning, and token usage tracking.",
    items: ["Real-time streaming of agent thoughts and actions", "Multi-step reasoning with tool call chaining", "Token usage tracking per session"],
  },
  {
    title: "Human-in-the-Loop Approval",
    desc: "Diff display before applying edits to prevent destructive actions.",
    items: ["Full diff preview before any file modification", "Approve or reject individual changes", "Safety net against unintended modifications"],
  },
  {
    title: "Path Traversal Protection",
    desc: "Ensures the agent cannot operate outside the project root directory.",
    items: ["All file operations scoped to project root", "Path validation before every tool execution", "Prevents accidental system file modification"],
  },
]

const toolSections = [
  {
    title: "Git tools",
    icon: GitBranch,
    count: 14,
    tools: [
      "commit", "push", "pull",
      "issue create / edit", "pr checkout / close / comment",
      "pr create / diff / edit / list / merge / status",
    ],
  },
  {
    title: "Filesystem tools",
    icon: FolderOpen,
    count: 4,
    tools: ["Read file contents", "Search files by pattern", "Write new files", "Edit with typed I/O, diff-based editing"],
  },
  {
    title: "Bash tools",
    icon: TerminalWindow,
    count: 3,
    tools: ["ls — list directory contents", "pwd — print working directory", "grep — search file contents"],
  },
  {
    title: "Planner sub-agent",
    icon: Robot,
    count: 5,
    tools: ["createTodoTool", "createAllTodosTool", "updateTodoStatusTool", "getNextPendingTodoTool", "checkIfAllTodosAreCompletedTool"],
  },
]

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Configuration & Provider System",
    desc: "Replace hardcoded model selection with a dynamic, user-configurable provider system.",
    items: ["Zod-schemas for typed config management", "Provider factory returning AI SDK models from config", "API key management per provider"],
    status: "In progress" as const,
  },
  {
    phase: "Phase 2",
    title: "Sessions & Conversation History",
    desc: "Session-based chat with persistent history, management, and export.",
    items: ["Session CRUD — create, list, read, append, export, delete", "Startup flow with session picker", "Export sessions as markdown or JSON"],
    status: "Planned" as const,
  },
  {
    phase: "Phase 3",
    title: "Parallel Sub-Agents",
    desc: "Run multiple executor sub-agents in parallel with file-level isolation.",
    items: ["Planner breaks tasks into non-conflicting todos", "Executor agents run via Promise.allSettled", "File-level isolation prevents write conflicts"],
    status: "Planned" as const,
  },
  {
    phase: "Phase 4",
    title: "Simpler TUI + Settings Screen",
    desc: "Streamlined Ink-based TUI with settings accessible from the chat.",
    items: ["Settings screen for providers, models, API keys", "Session picker on startup", "Keyboard shortcuts for common commands"],
    status: "Planned" as const,
  },
]

const risks = [
  { risk: "File conflicts during parallel execution", mitigation: "Structural prevention at plan time + runtime lock as safety net" },
  { risk: "ToolLoopAgent not designed for parallel agents", mitigation: "Each executor is its own ToolLoopAgent instance; orchestrated via Promise.allSettled" },
  { risk: "API keys stored in plaintext on disk", mitigation: ".agent/config.json is gitignored; V2 can add OS keychain integration" },
]

const upcomingFeatures = [
  "Memory for better context",
  "Token usage screen",
  "Run / build / execute code",
  "Voice mode",
  "Task completion notifier",
]

/* ------------------------------------------------------------------ */
/*  Twitter Embed                                                     */
/* ------------------------------------------------------------------ */

function TwitterEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (loaded) return
    const script = document.createElement("script")
    script.src = "https://platform.x.com/widgets.js"
    script.async = true
    script.onload = () => setLoaded(true)
    document.body.appendChild(script)
    return () => { script.remove() }
  }, [loaded])

  return (
    <div className="overflow-hidden">
      <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
        <a href={url} />
      </blockquote>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function Page() {
  return (
    <div className="mx-auto min-h-svh max-w-5xl px-6 py-16">
      {/* ──────────────── Hero ──────────────── */}
      <section className="mb-24">
        <div className="mx-auto mb-3 flex items-center justify-center gap-2">
          <Badge className="rounded-sm bg-blue-600/10 text-blue-600 hover:bg-blue-600/15">
            v1 of the project
          </Badge>
        </div>
        <h1 className="mx-auto mb-4 max-w-3xl text-center text-6xl font-bold tracking-tight text-foreground md:text-7xl">
          AI Coding Agent
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-center text-lg text-muted-foreground">
          A CLI-based AI coding companion built from scratch while reverse
          engineering Claude Code, OpenCode, and Codex. Autonomous code
          navigation, git integration, and human-in-the-loop safety.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://github.com/subhraneel2005/sidequests"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "rounded-md bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <GithubLogo size={16} />
            View on GitHub
          </a>
          <a
            href="#article"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "rounded-md"
            )}
          >
            <BookOpen size={16} />
            Read the Article
          </a>
        </div>

        <div className="mt-12 overflow-hidden rounded-md border">
          <img
            src="https://github.com/user-attachments/assets/35519a96-861b-4107-b7ce-7ea48a185014"
            alt="AI Coding Agent banner"
            className="w-full"
          />
        </div>
      </section>

      {/* ──────────────── Stats ──────────────── */}
      <section className="mb-24">
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-5 text-center">
              <p className="text-4xl font-semibold leading-none tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── How It Works ──────────────── */}
      <section className="mb-24">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          From idea to implementation
        </h2>
        <p className="mb-8 max-w-lg text-base text-muted-foreground">
          The agent follows a four-step flow that keeps you in control at every stage.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <Card key={step.step} size="sm" className={cn(i === 0 && "border-blue-600/20")}>
              <CardContent className="flex flex-col gap-3">
                <p className="text-5xl font-semibold tracking-tight leading-none text-foreground">{step.step}</p>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ──────────────── What Is This ──────────────── */}
      <section className="mb-24">
        <SectionLabel>About</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          What is this?
        </h2>
        <Card size="sm">
          <CardContent>
            <div className="max-w-2xl space-y-4 text-base text-muted-foreground">
              <p>
                A CLI-based AI coding companion that lives in your terminal. Built from scratch by
                reverse engineering Claude Code, OpenCode, and Codex — this project explores how
                autonomous coding agents work under the hood.
              </p>
              <p>
                Unlike IDE plugins, this agent operates entirely in the terminal with a
                tool-calling architecture. It reads, writes, and edits files, runs bash commands,
                manages git workflows, and breaks down complex tasks — all while keeping you in
                the loop with diff-based approval.
              </p>
              <p>
                Built with TypeScript, powered by Google Gemini 2.5 Flash via OpenRouter, and
                designed to be open-source and extensible.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ──────────────── Core Architecture ──────────────── */}
      <section className="mb-24">
        <SectionLabel>Architecture</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          Core Architecture
        </h2>
        <p className="mb-8 max-w-lg text-base text-muted-foreground">
          Four pillars that make the agent safe, capable, and extensible.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {coreFeatures.map((f) => (
            <Card key={f.title} size="sm">
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <ul className="space-y-1">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                      <ArrowRight size={11} className="mt-0.5 shrink-0 text-border" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ──────────────── Tools ──────────────── */}
      <section className="mb-24">
        <SectionLabel>Toolset</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          Everything the Agent Can Do
        </h2>
        <p className="mb-8 max-w-lg text-base text-muted-foreground">
          26 tools across four categories — from git operations to filesystem manipulation.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {toolSections.map((section) => (
            <Card key={section.title} size="sm">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <section.icon size={16} className="text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  <span className="ml-auto text-sm text-muted-foreground">{section.count}</span>
                </div>
                <div className="space-y-px">
                  {section.tools.map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
                    >
                      <ArrowRight size={10} className="shrink-0 text-border" />
                      {tool}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ──────────────── Roadmap ──────────────── */}
      <section className="mb-24">
        <SectionLabel>Roadmap</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          Development Roadmap
        </h2>
        <p className="mb-8 max-w-lg text-base text-muted-foreground">
          Four phases that transform the agent into a fully-featured open-source alternative.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {roadmapPhases.map((p, i) => (
            <Card key={p.phase} size="sm">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                 
                  <div>
                    <p className="text-md font-semibold text-foreground">{p.title}</p>
                    <span className="text-sm text-muted-foreground">{p.phase}</span>
                  </div>
                  <span className={cn("ml-auto text-sm", p.status === "In progress" ? "font-medium text-green-600" : "text-muted-foreground")}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <ul className="space-y-1">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                      <ArrowRight size={11} className="mt-0.5 shrink-0 text-border" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ──────────────── Risks ──────────────── */}
      <section className="mb-24">
        <SectionLabel>Mitigations</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          Risks &amp; Mitigations
        </h2>
        <p className="mb-8 max-w-lg text-base text-muted-foreground">
          Every design decision is paired with a plan for handling edge cases.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {risks.map((r) => (
            <Card key={r.risk} size="sm">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <Warning size={14} className="mt-0.5 shrink-0 text-muted-foreground/60" />
                  <p className="text-sm font-medium text-foreground">{r.risk}</p>
                </div>
                <p className="ml-6 text-sm leading-relaxed text-muted-foreground">{r.mitigation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ──────────────── Article ──────────────── */}
      <section id="article" className="mb-24">
        <SectionLabel>Article</SectionLabel>
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
          Technical Deep Dive
        </h2>
        <p className="mb-6 max-w-lg text-base text-muted-foreground">
          I wrote about how I reverse engineered Claude Code and built the V1 of this agent.
        </p>
        <div className="mx-auto max-w-lg">
          <Card size="sm">
            <CardContent className="p-4">
              <TwitterEmbed url="https://x.com/subhraneeltwt/status/2062556155113837014" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ──────────────── Footer ──────────────── */}
      <footer className="border-t pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://github.com/subhraneel2005/sidequests" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
              <GithubLogo size={14} />
              GitHub
            </a>
            <a href="https://x.com/subhraneeltwt" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
              <Users size={14} />
              @subhraneeltwt
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with TypeScript, Next.js &amp; shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{children}</span>
      <Separator className="flex-1" />
    </div>
  )
}
