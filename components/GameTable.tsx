// Game Table Component
// Renders table data from Sanity with clean styling

interface TableRow {
  _key: string
  cells: string[]
}

interface TableData {
  headers: string[]
  rows: TableRow[]
}

interface GameTableProps {
  tableData: TableData
  caption?: string
  highlightFirstColumn?: boolean
  striped?: boolean
}

export default function GameTable({
  tableData,
  caption,
  highlightFirstColumn = false,
  striped = true,
}: GameTableProps) {
  if (!tableData?.headers || tableData.headers.length === 0) {
    return null
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-bg-tertiary)]">
              {tableData.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows?.map((row, rowIndex) => (
              <tr
                key={row._key || rowIndex}
                className={`
                  border-b border-[var(--color-border)] last:border-b-0
                  ${striped && rowIndex % 2 === 1 ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-primary)]'}
                  hover:bg-[var(--color-bg-tertiary)] transition-colors
                `}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`
                      px-4 py-3 text-[var(--color-text-secondary)]
                      ${highlightFirstColumn && cellIndex === 0 ? 'font-medium text-white' : ''}
                    `}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="mt-2 text-xs text-[var(--color-text-muted)] text-center italic">
          {caption}
        </p>
      )}
    </div>
  )
}
