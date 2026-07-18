import React from 'react'
import { Box, Text } from 'ink'

interface ToolLogProps {
  title?: string
  logs: string[]
}

export default function ToolLog({ title, logs }: ToolLogProps) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {title && <Text bold>{title}</Text>}
      {logs.map((log, i) => (
        <Text key={i} dimColor>
          {log}
        </Text>
      ))}
    </Box>
  )
}
