import React from 'react'
import { Box, Text } from 'ink'

type InlineToken =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'code'; content: string }
  | { type: 'link'; content: string; href: string }

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      tokens.push({ type: 'text', content: text.slice(last, m.index) })
    }
    if (m[1] !== undefined) tokens.push({ type: 'code', content: m[1] })
    else if (m[2] !== undefined) tokens.push({ type: 'bold', content: m[2] })
    else if (m[3] !== undefined) tokens.push({ type: 'italic', content: m[3] })
    else if (m[4] !== undefined && m[5] !== undefined) tokens.push({ type: 'link', content: m[4], href: m[5] })
    last = m.index + m[0].length
  }

  if (last < text.length) {
    tokens.push({ type: 'text', content: text.slice(last) })
  }

  return tokens
}

function Inline({ text }: { text: string }) {
  const tokens = tokenizeInline(text)
  return (
    <Text>
      {tokens.map((token, i) => {
        switch (token.type) {
          case 'bold':
            return <Text key={i} bold>{token.content}</Text>
          case 'italic':
            return <Text key={i} italic>{token.content}</Text>
          case 'code':
            return <Text key={i} color="#8a94a6">{token.content}</Text>
          case 'link':
            return <Text key={i} underline>{token.content}</Text>
          default:
            return token.content
        }
      })}
    </Text>
  )
}

function splitBlocks(md: string): string[][] {
  const blocks: string[][] = []
  let current: string[] = []
  let inFence = false

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current)
      current = []
    }
  }

  for (const raw of md.split('\n')) {
    const line = raw.trimEnd()
    const trimmed = line.trimStart()

    if (trimmed.startsWith('```')) {
      if (inFence) {
        current.push(line)
        flush()
        inFence = false
      } else {
        flush()
        current.push(line)
        inFence = true
      }
      continue
    }

    if (!inFence && trimmed === '') {
      flush()
      continue
    }

    current.push(line)
  }

  flush()
  return blocks
}

function Line({ line }: { line: string }) {
  const trimmed = line.trimStart()

  const quote = trimmed.match(/^>\s?(.*)$/)
  if (quote) {
    return (
      <Text dimColor>│ {quote[1]}</Text>
    )
  }

  const bullet = trimmed.match(/^[-*+]\s+(.*)$/)
  if (bullet) {
    return (
      <Text>  • <Inline text={bullet[1] ?? ''} /></Text>
    )
  }

  const numbered = trimmed.match(/^(\d+)[.)]\s+(.*)$/)
  if (numbered) {
    return (
      <Text>  {numbered[1]}. <Inline text={numbered[2] ?? ''} /></Text>
    )
  }

  return <Inline text={trimmed} />
}

function Block({ block }: { block: string[] }) {
  const first = block[0] ?? ''
  const trimmed = first.trimStart()

  if (trimmed.startsWith('```')) {
    const code = block.slice(1, Math.max(1, block.length - 1)).join('\n')
    return (
      <Box flexDirection="column">
        {code.split('\n').map((line, i) => (
          <Text key={i} color="#8a94a6" dimColor>
            {line}
          </Text>
        ))}
      </Box>
    )
  }

  const heading = trimmed.match(/^(#{1,6})\s+(.*)$/)
  if (heading) {
    const level = (heading[1] ?? '').length
    const content = heading[2] ?? ''
    const sep = level <= 1 ? '#' : level === 2 ? '##' : '###'
    return (
      <Text bold>
        {sep} {content}
      </Text>
    )
  }

  if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
    return <Text dimColor>{'─'.repeat(40)}</Text>
  }

  return (
    <Box flexDirection="column">
      {block.map((line, i) => (
        <Line key={i} line={line} />
      ))}
    </Box>
  )
}

interface MarkdownProps {
  children: string
}

export default function Markdown({ children }: MarkdownProps) {
  const blocks = splitBlocks(children)
  return (
    <Box flexDirection="column">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </Box>
  )
}
