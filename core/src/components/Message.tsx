import React from 'react'
import { Box, Text } from 'ink'

interface MessageProps {
  role: "assistant" | "system" | "tool" | "user"
  content: string
}

export default function Message({ role, content }: MessageProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold>
        {role.toUpperCase()}
      </Text>
      <Text>{content}</Text>
    </Box>
  )
}
