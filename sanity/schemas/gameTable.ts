// Game Table Schema
// Allows pasting table data from Word/Excel for game reviews

import { defineType, defineField } from 'sanity'
import TableInput from '../components/TableInput'

export const gameTable = defineType({
  name: 'gameTable',
  title: 'Data Table',
  type: 'object',
  fields: [
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Optional rich text displayed before the table',
    }),
    defineField({
      name: 'title',
      title: 'Table Title',
      type: 'string',
      description: 'Optional heading displayed above the table',
    }),
    defineField({
      name: 'tableData',
      title: 'Table Data',
      type: 'object',
      components: {
        input: TableInput,
      },
      fields: [
        defineField({
          name: 'headers',
          title: 'Headers',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'tableRow',
              fields: [
                defineField({
                  name: 'cells',
                  title: 'Cells',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Table Caption',
      type: 'string',
      description: 'Optional caption displayed below the table',
    }),
    defineField({
      name: 'highlightFirstColumn',
      title: 'Highlight First Column',
      type: 'boolean',
      description: 'Make the first column bold (useful for row labels)',
      initialValue: false,
    }),
    defineField({
      name: 'striped',
      title: 'Striped Rows',
      type: 'boolean',
      description: 'Alternate row background colors',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tableData: 'tableData',
    },
    prepare: ({ title, tableData }) => {
      const rowCount = tableData?.rows?.length || 0
      const colCount = tableData?.headers?.length || 0
      return {
        title: title || 'Data Table',
        subtitle: `${rowCount} rows, ${colCount} columns`,
      }
    },
  },
})
