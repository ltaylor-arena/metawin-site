// Feature Cards Schema
// "Reasons to Play" style feature highlights

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featureCards',
  title: 'Feature Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Reasons to Play at MetaWin',
    }),
    defineField({
      name: 'cards',
      title: 'Feature Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featureCard',
          title: 'Feature Card',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Check', value: 'check' },
                  { title: 'Zap (Lightning)', value: 'zap' },
                  { title: 'Trophy', value: 'trophy' },
                  { title: 'Gift', value: 'gift' },
                  { title: 'Users', value: 'users' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Star', value: 'star' },
                  { title: 'Clock', value: 'clock' },
                  { title: 'Wallet', value: 'wallet' },
                  { title: 'Lock', value: 'lock' },
                ],
              },
              initialValue: 'check',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      cards: 'cards',
    },
    prepare: ({ title, cards }) => ({
      title: title || 'Feature Cards',
      subtitle: `${cards?.length || 0} cards`,
    }),
  },
})
