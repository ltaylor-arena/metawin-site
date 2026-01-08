// Game Carousel Schema
// Configurable carousel for displaying games

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gameCarousel',
  title: 'Game Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'e.g., "Big Wins", "New Releases", "Popular Slots"',
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
      initialValue: 12,
      hidden: ({ parent }) => parent?.displayMode === 'manual',
    }),
    
    // Visual options
    defineField({
      name: 'showWinAmounts',
      title: 'Show Win Amounts',
      type: 'boolean',
      description: 'Display recent win amounts on game cards (like Big Wins section)',
      initialValue: false,
    }),
    defineField({
      name: 'cardSize',
      title: 'Card Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
      },
      initialValue: 'medium',
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
      title: title || 'Game Carousel',
      subtitle: `Mode: ${displayMode}`,
    }),
  },
})
