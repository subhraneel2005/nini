import React, { useCallback, useState } from 'react'
import { Box, Text } from 'ink'
import Message from './Message.js'
import Input from './Input.js'
import ToolExecution from './ToolExecution.js'
import { appendMessage } from '../service-logics/project-config.js'
import { runAgentTurn } from '../service-logics/agent-run.js'
import type { SessionConfigType } from '../types/config-types.js'

interface ChatMessage {
  id: number | string
  role: 'assistant' | 'system' | 'tool' | 'user'
  content: string
}

interface ChatProps {
  initMessages: ChatMessage[]
  session: SessionConfigType
}

function parseToolContent(content: string): {
  toolName: string
  status: 'running' | 'completed' | 'failed'
} | null {
  const match = content.match(/^\[(call|done|error)\] (.+)$/)
  if (!match) return null
  const tag = match[1]
  const toolName = match[2]
  if (!tag || !toolName) return null
  const status = tag === 'call' ? 'running' : tag === 'done' ? 'completed' : 'failed'
  return { toolName, status }
}

export default function ChatComponent({ initMessages, session }: ChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(initMessages)
  const [isRunning, setIsRunning] = useState(false)

  const onSubmit = useCallback(async (value: string) => {
    if (isRunning) return
    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: value }])
    await appendMessage(session, { role: 'user', content: value, timestamp: new Date().toISOString() })

    setIsRunning(true)
    try {
      await runAgentTurn(session, value, {
        onAssistantDelta: (_delta, full) => {
          setMessages(prev => {
            const copy = [...prev]
            const last = copy[copy.length - 1]
            if (last && last.role === 'assistant') {
              copy[copy.length - 1] = { ...last, content: full }
            } else {
              copy.push({ id: `assistant-${Date.now()}`, role: 'assistant', content: full })
            }
            return copy
          })
        },
        onAssistantDone: () => {},
        onToolCall: ({ toolCallId, toolName }) => {
          setMessages(prev => [...prev, { id: toolCallId, role: 'tool', content: `[call] ${toolName}` }])
        },
        onToolResult: ({ toolCallId, toolName }) => {
          setMessages(prev => prev.map(m => (m.id === toolCallId ? { ...m, content: `[done] ${toolName}` } : m)))
        },
        onToolError: ({ toolCallId, toolName }) => {
          setMessages(prev => prev.map(m => (m.id === toolCallId ? { ...m, content: `[error] ${toolName}` } : m)))
        },
        onError: error => {
          const message = error instanceof Error ? error.message : String(error)
          setMessages(prev => [...prev, { id: Date.now(), role: 'system', content: `Agent error: ${message}` }])
        },
        onTokenUsage: () => {},
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setMessages(prev => [...prev, { id: Date.now(), role: 'system', content: `Agent error: ${message}` }])
    } finally {
      setIsRunning(false)
    }
  }, [isRunning, session])

  return (
    <Box flexDirection="column" padding={1}>
      {messages.length === 0 ? (
        <Text dimColor>No messages yet</Text>
      ) : (
        messages.map(msg => {
          if (msg.role === 'tool') {
            const parsed = parseToolContent(msg.content)
            if (parsed) {
              return <ToolExecution key={msg.id} toolName={parsed.toolName} status={parsed.status} />
            }
          }
          return <Message key={msg.id} role={msg.role} content={msg.content} />
        })
      )}
      <Box marginTop={1}>
        {isRunning ? (
          <Text dimColor>Working...</Text>
        ) : (
          <Input value={input} onChange={setInput} onSubmit={onSubmit} placeholder="Type your message..." />
        )}
      </Box>
    </Box>
  )
}
