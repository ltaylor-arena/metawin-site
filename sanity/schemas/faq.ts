// FAQ Schema
// Collapsible FAQ section with structured data support

import { defineType, defineField } from 'sanity'
import { richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'faq',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [richTextBlockSimple],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      items: 'items',
    },
    prepare: ({ heading, items }) => ({
      title: heading || 'FAQ Section',
      subtitle: `${items?.length || 0} questions`,
    }),
  },
})
