// Custom Sanity Input for Pasting Table Data
// Allows users to paste tab-separated table data from Word/Excel

'use client'

import { useCallback, useState } from 'react'
import { Stack, Text, TextArea, Button, Card, Box, Flex } from '@sanity/ui'
import { set, unset } from 'sanity'
import type { ObjectInputProps } from 'sanity'

interface TableRow {
  _key: string
  cells: string[]
}

interface TableData {
  headers: string[]
  rows: TableRow[]
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 9)
}

function parseTableData(text: string): TableData | null {
  if (!text.trim()) return null

  // Split by newlines, handling both Windows (\r\n) and Unix (\n) line endings
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim())

  if (lines.length === 0) return null

  // Split each line by tabs (Word/Excel) or multiple spaces (fallback)
  const parseRow = (line: string): string[] => {
    // Try tab-separated first
    if (line.includes('\t')) {
      return line.split('\t').map(cell => cell.trim())
    }
    // Fallback to pipe-separated (common in markdown tables)
    if (line.includes('|')) {
      return line.split('|').map(cell => cell.trim()).filter(cell => cell)
    }
    // Single column fallback
    return [line.trim()]
  }

  const parsedRows = lines.map(parseRow)

  // First row is headers
  const headers = parsedRows[0] || []

  // Rest are data rows
  const rows: TableRow[] = parsedRows.slice(1).map(cells => ({
    _key: generateKey(),
    cells: cells,
  }))

  return { headers, rows }
}

export default function TableInput(props: ObjectInputProps) {
  const { value, onChange } = props
  const [pasteText, setPasteText] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const tableData = value as TableData | undefined

  const handleParse = useCallback(() => {
    const parsed = parseTableData(pasteText)
    if (parsed) {
      onChange(set(parsed))
      setPasteText('')
      setShowPreview(false)
    }
  }, [pasteText, onChange])

  const handleClear = useCallback(() => {
    onChange(unset())
    setPasteText('')
  }, [onChange])

  const previewData = parseTableData(pasteText)

  return (
    <Stack space={4}>
      {/* Instructions */}
      <Card padding={3} radius={2} tone="primary">
        <Text size={1}>
          Paste table data from Word, Excel, or Google Sheets. Data should be tab-separated
          (copy directly from spreadsheet or Word table). First row will be used as headers.
        </Text>
      </Card>

      {/* Paste Area */}
      <Stack space={3}>
        <Text size={1} weight="semibold">Paste Table Data:</Text>
        <TextArea
          value={pasteText}
          onChange={(e) => {
            setPasteText(e.currentTarget.value)
            setShowPreview(true)
          }}
          placeholder="Paste your table data here...&#10;&#10;Example:&#10;Header 1	Header 2	Header 3&#10;Row 1 Cell 1	Row 1 Cell 2	Row 1 Cell 3&#10;Row 2 Cell 1	Row 2 Cell 2	Row 2 Cell 3"
          rows={6}
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
        <Flex gap={2}>
          <Button
            text="Parse & Save Table"
            tone="primary"
            onClick={handleParse}
            disabled={!pasteText.trim()}
          />
          {tableData && (
            <Button
              text="Clear Table"
              tone="critical"
              mode="ghost"
              onClick={handleClear}
            />
          )}
        </Flex>
      </Stack>

      {/* Preview of pasted data */}
      {showPreview && previewData && pasteText && (
        <Stack space={3}>
          <Text size={1} weight="semibold">Preview:</Text>
          <Card padding={3} radius={2} tone="transparent" style={{ overflow: 'auto' }}>
            <Box style={{ minWidth: 'max-content' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--card-bg-color)' }}>
                    {previewData.headers.map((header, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '8px 12px',
                          textAlign: 'left',
                          borderBottom: '2px solid var(--card-border-color)',
                          fontWeight: 600,
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--card-border-color)',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Stack>
      )}

      {/* Current saved table */}
      {tableData && tableData.headers && tableData.headers.length > 0 && (
        <Stack space={3}>
          <Text size={1} weight="semibold">Saved Table ({tableData.rows?.length || 0} rows):</Text>
          <Card padding={3} radius={2} tone="positive" style={{ overflow: 'auto' }}>
            <Box style={{ minWidth: 'max-content' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--card-bg-color)' }}>
                    {tableData.headers.map((header, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '8px 12px',
                          textAlign: 'left',
                          borderBottom: '2px solid var(--card-border-color)',
                          fontWeight: 600,
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows?.map((row, rowIndex) => (
                    <tr key={row._key || rowIndex}>
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--card-border-color)',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Stack>
      )}
    </Stack>
  )
}
