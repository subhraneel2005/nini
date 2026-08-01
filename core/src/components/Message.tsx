import React from 'react'
import { Box, Text } from 'ink'
import Markdown from './Markdown.js'

interface MessageProps {
  role: "assistant" | "system" | "tool" | "user"
  content: string
}

export default function Message({ role, content }: MessageProps) {
  const rendersMarkdown = role === 'assistant' || role === 'system'
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold>
        {role.toUpperCase()}
      </Text>
      {rendersMarkdown ? (
        <Markdown>{content}</Markdown>
      ) : (
        <Text>{content}</Text>
      )}
    </Box>
  )
}
