import React, { useState, useCallback } from 'react'
import { Box, Text } from 'ink'
import Chat from './Chat.js'
import Input from './Input.js'
import ToolExecution from './ToolExecution.js'
import ToolLog from './ToolLog.js'
import DiffViewer from './DiffViewer.js'
import ApprovalPrompt from './ApprovalPrompt.js'

export default function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([
    { id: '1', role: 'assistant', content: 'Hello! How can I help you?' },
  ])
  const [toolStatus, setToolStatus] = useState<'running' | 'completed' | 'failed'>('completed')
  const [showApproval, setShowApproval] = useState(false)

  const onSubmit = useCallback((value: string) => {
    setMessages(prev => [
      ...prev,
      { id: String(Date.now()), role: 'user', content: value },
      { id: String(Date.now() + 1), role: 'assistant', content: `You said: "${value}"` },
    ])
    setInput('')
    setToolStatus('completed')
  }, [])

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1} flexDirection="column" padding={1}>
        <Chat messages={messages} />

        <Box marginY={1}>
          <ToolExecution
            toolName="read-file"
            status={toolStatus}
            duration={toolStatus === 'completed' ? 142 : undefined}
          />
        </Box>

        <Box marginY={1}>
          <ToolLog
            title="read-file output"
            logs={[
              "import { render, Box, Text } from 'ink'",
              '',
              '// Example component',
            ]}
          />
        </Box>

        <Box marginY={1}>
          <DiffViewer
            filePath="src/components/Input.tsx"
            diff={[
            '--- a/src/Input.tsx',
            '+++ b/src/Input.tsx',
            '@@ -1,5 +1,8 @@',
            '-const x = 1',
            '+const x = 2',
            ' function foo() {',
            '-  return x',
            '+  return x + 1',
            ' }',
          ].join('\n')}
          />
        </Box>

        {showApproval && (
          <Box marginY={1}>
            <ApprovalPrompt
              message="Allow tool to read /etc/passwd?"
              onConfirm={() => setShowApproval(false)}
              onReject={() => setShowApproval(false)}
            />
          </Box>
        )}
      </Box>

      <Box borderStyle="single" paddingX={1} paddingY={0}>
        <Input
          value={input}
          onChange={setInput}
          onSubmit={onSubmit}
          placeholder="Type your message..."
        />
      </Box>
    </Box>
  )
}
