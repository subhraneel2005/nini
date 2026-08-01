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
  return (
    <Box>
      <Text color="#8a94a6" dimColor>
        {icon} {toolName}
      </Text>
      {duration !== undefined && <Text color="#8a94a6" dimColor> ({duration}ms)</Text>}
    </Box>
  )
}
