import React from 'react'
import { Box, Text } from 'ink'

interface DiffViewerProps {
  diff: string
  filePath?: string
}

export default function DiffViewer({ diff, filePath }: DiffViewerProps) {
  const lines = diff.split('\n')
  return (
    <Box flexDirection="column">
      {filePath && <Text bold>{filePath}</Text>}
      {lines.map((line, i) => {
        let color: string | undefined
        if (line.startsWith('+')) color = 'green'
        else if (line.startsWith('-')) color = 'red'
        return (
          <Text key={i} color={color}>
            {line}
          </Text>
        )
      })}
    </Box>
  )
}
