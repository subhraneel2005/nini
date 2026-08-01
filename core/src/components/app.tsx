import React, { useState } from 'react'
import { Box, Text } from 'ink'
import Chat from './Chat.js'
import ToolExecution from './ToolExecution.js'
import ToolLog from './ToolLog.js'
import DiffViewer from './DiffViewer.js'
import ApprovalPrompt from './ApprovalPrompt.js'
import { ProviderEnum } from '../types/config-types.js'
import type { SessionConfigType } from '../types/config-types.js'

const fakeSession: SessionConfigType = {
  id: 'preview',
  projectHash: 'preview',
  provider: ProviderEnum.openrouter,
  model: 'openrouter/free',
  tokenUsed: 0,
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const initMessages = [
  { id: 1, role: 'assistant' as const, content: 'Hello! How can I help you?' },
]

export default function App() {
  const [toolStatus, setToolStatus] = useState<'running' | 'completed' | 'failed'>('completed')
  const [showApproval, setShowApproval] = useState(false)

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1} flexDirection="column" padding={1}>
        <Chat initMessages={initMessages} session={fakeSession} />

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
    </Box>
  )
}
