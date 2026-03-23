// Organization Schema for Structured Data
// Simple text field to paste raw JSON-LD

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'organizationSchema',
  title: 'Organization Schema',
  type: 'object',
  fields: [
    defineField({
      name: 'jsonLd',
      title: 'JSON-LD Schema',
      type: 'text',
      rows: 15,
      description: 'Paste your complete JSON-LD structured data here (including the @context and @type fields). This will be output as-is in a <script type="application/ld+json"> tag.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          try {
            JSON.parse(value)
            return true
          } catch {
            return 'Must be valid JSON'
          }
        }),
    }),
  ],
})
