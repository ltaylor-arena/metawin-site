// Game Category Grid Schema
// Auto-populated grid of game category tiles with icons and counts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gameCategoryGrid',
  title: 'Game Category Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading above the grid (e.g., "Browse Games")',
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading Level',
      type: 'string',
      options: {
        list: [
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'None (div)', value: 'div' },
        ],
      },
      initialValue: 'h2',
      hidden: ({ parent }) => !parent?.heading,
    }),
    defineField({
      name: 'maxItems',
      title: 'Max Items',
      type: 'number',
      description: 'Maximum number of category tiles to show (default: 8)',
      initialValue: 8,
      validation: (Rule) => Rule.min(2).max(24).integer(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      description: 'Number of columns on desktop (default: 4)',
      options: {
        list: [3, 4, 5, 6],
      },
      initialValue: 4,
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: heading || 'Game Category Grid',
      subtitle: 'Auto-populated category tiles',
    }),
  },
})
