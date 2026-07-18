import React from 'react'
import { Box, Text } from 'ink'

interface ToolExecutionProps {
  toolName: string
  status: 'running' | 'completed' | 'failed'
  duration?: number
}

const icons: Record<string, string> = {
  running: '…',
  completed: '✓',
  failed: '✗',
}

export default function ToolExecution({ toolName, status, duration }: ToolExecutionProps) {
  const icon = icons[status] ?? '…'
  const dim = status === 'running'
  return (
    <Box>
      <Text bold={!dim} dimColor={dim}>
        {icon} {toolName}
      </Text>
      {duration !== undefined && <Text dimColor> ({duration}ms)</Text>}
    </Box>
  )
}
