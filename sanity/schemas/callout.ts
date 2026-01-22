// Callout Schema
// Attention box with icon, title, and body text

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Callout heading (e.g., "Important", "Note", "Warning")',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Body text for the callout',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Info (Blue)', value: 'info' },
          { title: 'Warning (Yellow)', value: 'warning' },
          { title: 'Success (Green)', value: 'success' },
          { title: 'Tip (Purple)', value: 'tip' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    }),
  ],
  preview: {
    select: { title: 'title', variant: 'variant' },
    prepare: ({ title, variant }) => ({
      title: title || 'Callout',
      subtitle: `${variant || 'info'} callout`,
    }),
  },
})
