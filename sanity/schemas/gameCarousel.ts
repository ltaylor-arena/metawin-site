// Game Table Schema
// Configurable table for displaying games in wiki-style format

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gameCarousel',
  title: 'Game Table',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'e.g., "Featured Games", "New Releases", "Popular Slots"',
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading Level',
      type: 'string',
      description: 'HTML heading level for SEO',
      options: {
        list: [
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'None (div)', value: 'div' },
        ],
        layout: 'radio',
      },
      initialValue: 'h2',
    }),
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Manual Selection', value: 'manual' },
          { title: 'By Category', value: 'category' },
          { title: 'Latest Games', value: 'latest' },
          { title: 'Popular Games', value: 'popular' },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),

    // Manual game selection
    defineField({
      name: 'games',
      title: 'Games',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'game' }],
        },
      ],
      hidden: ({ parent }) => parent?.displayMode !== 'manual',
    }),

    // Category-based selection
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.displayMode !== 'category',
    }),

    // Limit for auto modes
    defineField({
      name: 'limit',
      title: 'Number of Games to Show',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(1).max(50),
      hidden: ({ parent }) => parent?.displayMode === 'manual',
    }),

    // Link to view all
    defineField({
      name: 'viewAllLink',
      title: 'View All Link',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'category' }],
      description: 'Optional link to a page showing all games in this section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      displayMode: 'displayMode',
    },
    prepare: ({ title, displayMode }) => ({
      title: title || 'Game Table',
      subtitle: `Mode: ${displayMode}`,
    }),
  },
})
