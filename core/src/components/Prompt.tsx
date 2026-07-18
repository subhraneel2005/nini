import React from 'react'
import { Box, Text } from 'ink'

interface PromptProps {
  value: string
  placeholder?: string
}

export default function Prompt({ value, placeholder = 'Type a message...' }: PromptProps) {
  const display = value || placeholder
  const dim = value.length === 0
  return (
    <Box>
      <Text>&gt; </Text>
      <Text dimColor={dim}>{display}</Text>
    </Box>
  )
}
