// Game Content Blocks
// Reorderable content blocks for game pages (middle section only)

import { defineType, defineField } from 'sanity'

// Quick Summary Block
export const gameQuickSummary = defineType({
  name: 'gameQuickSummary',
  title: 'Quick Summary',
  type: 'object',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text introduction for the game',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Quick Summary',
      subtitle: 'Intro text with thumbnail',
    }),
  },
})

// Pros and Cons Block
export const gameProsAndCons = defineType({
  name: 'gameProsAndCons',
  title: 'Pros and Cons',
  type: 'object',
  fields: [
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      description: 'Advantages of this game (displayed with green tick icons)',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      description: 'Disadvantages of this game (displayed with red cross icons)',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: { pros: 'pros', cons: 'cons' },
    prepare: ({ pros, cons }) => ({
      title: 'Pros and Cons',
      subtitle: `${pros?.length || 0} pros, ${cons?.length || 0} cons`,
    }),
  },
})

// Rich Text Block (for game pages)
export const gameRichText = defineType({
  name: 'gameRichText',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { content: 'content' },
    prepare: ({ content }) => {
      const firstBlock = content?.find((block: any) => block._type === 'block')
      const text = firstBlock?.children?.map((child: any) => child.text).join('') || ''
      return {
        title: 'Rich Text',
        subtitle: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      }
    },
  },
})

// Author's Thoughts Block
export const gameAuthorThoughts = defineType({
  name: 'gameAuthorThoughts',
  title: "Author's Thoughts",
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: "The author's personal thoughts or opinions (displayed in italics)",
    }),
  ],
  preview: {
    select: { content: 'content' },
    prepare: ({ content }) => {
      const firstBlock = content?.find((block: any) => block._type === 'block')
      const text = firstBlock?.children?.map((child: any) => child.text).join('') || ''
      return {
        title: "Author's Thoughts",
        subtitle: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      }
    },
  },
})
