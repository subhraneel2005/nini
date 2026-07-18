import React, { useCallback, useState } from 'react'
import { Box, Text } from 'ink'
import Message from './Message.js'
import Input from './Input.js';
import { appendMessage } from '../service-logics/project-config.js';
import type { SessionConfigType } from '../types/config-types.js';

interface ChatMessage {
  id: number
  role: "assistant" | "system" | "tool" | "user"
  content: string
}

interface ChatProps {
  initMessages: ChatMessage[]
  session: SessionConfigType
}

export default function ChatComponent({ initMessages, session }: ChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(initMessages)

  const onSubmit = useCallback((value: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'user', content: value },
    ])
    appendMessage(session, {role: "user", content: value, timestamp: new Date().toISOString()})
    setInput('')
  }, [session])

  return (
    <Box flexDirection="column" padding={1}>
      {messages.length === 0 ? (
        <Text dimColor>No messages yet</Text>
      ) : (
        messages.map(msg => (
          <Message key={msg.id} role={msg.role} content={msg.content} />
        ))
      )}
      <Input
          value={input}
          onChange={setInput}
          onSubmit={onSubmit}
          placeholder="Type your message..."
        />
    </Box>
  )
}

