// Hero Schema
// Full-width hero banner with layered background and editable text

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small text above the headline (e.g., "Welcome to MetaWin")',
      initialValue: 'Welcome to MetaWin',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main headline text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Sign In',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      description: 'External URL or internal path (internal links must end with /)',
      initialValue: 'https://metawin.com/signin',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        if (value.startsWith('/') && !value.endsWith('/')) {
          return 'Internal URLs must end with a trailing slash'
        }
        return true
      }),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      eyebrow: 'eyebrow',
    },
    prepare: ({ title, eyebrow }) => ({
      title: title || 'Hero Banner',
      subtitle: eyebrow || 'No eyebrow text',
    }),
  },
})
