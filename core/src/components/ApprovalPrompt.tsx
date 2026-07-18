import React from 'react'
import { Box, Text } from 'ink'

interface ApprovalPromptProps {
  message: string
  onConfirm: () => void
  onReject: () => void
}

export default function ApprovalPrompt({ message, onConfirm, onReject }: ApprovalPromptProps) {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round">
      <Text>{message}</Text>
      <Box marginTop={1}>
        <Text bold>[Y]es</Text>
        <Text> </Text>
        <Text bold>[N]o</Text>
      </Box>
    </Box>
  )
}
