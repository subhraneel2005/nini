#!/usr/bin/env bun

import { Command } from "commander";
import { initCommand } from "./commands/init";
import { chatCommand } from "./commands/chat";
import { showUsageCommand } from "./commands/show-usage";
import { showConfigCommand } from "./commands/show-config";
import { changeProviderCommand } from "./commands/change-provider";
import { newChatCommand } from "./commands/new-chat";
import { lsProjectsCommand } from "./commands/ls-projects";
import { listSessionsCommand } from "./commands/list-sessions";
import { resumeLtsSessionCommand } from "./commands/resume-lts-session";
import { resumeSpecificSessionCommand } from "./commands/resume-specific-session";
import { deleteSessionCommand } from "./commands/delete-session";

const program = new Command()

program.name("nini")

program.command("init").action(initCommand)
program.command("chat").action(chatCommand)
program.command("show-usage").action(showUsageCommand)
program.command("show-config").action(showConfigCommand)
program.command("change-provider").action(changeProviderCommand)
program.command("new-chat").action(newChatCommand)
program.command("ls-projects").action(lsProjectsCommand)
program.command("list-sessions").action(listSessionsCommand)
program.command("resume-lts-session").action(resumeLtsSessionCommand)
program.command("resume-specific-session").argument("<sessionId>", "session id to resume").action(resumeSpecificSessionCommand)
program.command("delete-session").argument("<sessionId>", "session id to delete").action(deleteSessionCommand)

program.parse()