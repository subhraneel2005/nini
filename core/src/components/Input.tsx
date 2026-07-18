import React from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'

interface InputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
}

export default function Input({ value, onChange, onSubmit, placeholder = 'Type a message...' }: InputProps) {
  return (
    <Box borderStyle="single" borderDimColor>
      <Box marginRight={1}>
        <Text></Text>
      </Box>
      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
      />
    </Box>
  )
}
