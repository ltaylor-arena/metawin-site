// Game Schema
// Individual game entries

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'game',
  title: 'Game',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'details', title: 'Game Details' },
    { name: 'media', title: 'Media' },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Game Title',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Game Provider',
      type: 'string',
      group: 'basic',
      description: 'e.g., Pragmatic Play, NetEnt, Evolution',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
    }),
    defineField({
      name: 'externalGameUrl',
      title: 'External Game URL',
      type: 'url',
      group: 'basic',
      description: 'Link to play this game on the main platform',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Game',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      title: 'New Release',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),

    // Game Details
    defineField({
      name: 'rtp',
      title: 'RTP %',
      type: 'number',
      group: 'details',
      description: 'Return to Player percentage',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'volatility',
      title: 'Volatility',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
        ],
      },
    }),
    defineField({
      name: 'paylines',
      title: 'Paylines',
      type: 'string',
      group: 'details',
      description: 'e.g., "243", "Megaways", "10"',
    }),
    defineField({
      name: 'reels',
      title: 'Reels',
      type: 'number',
      group: 'details',
      description: 'Number of reels (e.g., 5)',
    }),
    defineField({
      name: 'maxWin',
      title: 'Max Win',
      type: 'string',
      group: 'details',
      description: 'e.g., "5,000x", "$250,000"',
    }),
    defineField({
      name: 'minBet',
      title: 'Min Bet',
      type: 'string',
      group: 'details',
      description: 'e.g., "$0.20", "0.10"',
    }),
    defineField({
      name: 'maxBet',
      title: 'Max Bet',
      type: 'string',
      group: 'details',
      description: 'e.g., "$100", "500"',
    }),
    defineField({
      name: 'hasBonusFeature',
      title: 'Bonus Feature?',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'hasFreeSpins',
      title: 'Free Spins?',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'hasAutoplay',
      title: 'Autoplay?',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      group: 'details',
      options: {
        dateFormat: 'MMMM YYYY',
      },
    }),

    // Media
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      group: 'media',
      description: 'Game screenshots for the slideshow',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    // Content
    defineField({
      name: 'quickSummary',
      title: 'Quick Summary',
      type: 'object',
      group: 'content',
      description: 'A highlighted summary box that appears at the top of the game page',
      fields: [
        defineField({
          name: 'intro',
          title: 'Intro Text',
          type: 'text',
          rows: 2,
          description: 'A short 1-2 sentence introduction',
        }),
        defineField({
          name: 'highlights',
          title: 'Highlights',
          type: 'array',
          description: 'Key selling points displayed with tick icons',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'content',
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
              description: 'Important for accessibility and SEO',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption displayed below the image',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'additionalContent',
      title: 'Additional Content',
      type: 'array',
      group: 'content',
      description: 'Rich text sections that appear below the game details',
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
              description: 'Important for accessibility and SEO',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption displayed below the image',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'content',
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
              of: [{ type: 'block' }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),

    // Authorship
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'content',
      description: 'Manually set when content is significantly updated',
    }),
    defineField({
      name: 'showAuthorInfo',
      title: 'Show Author Info',
      type: 'boolean',
      group: 'content',
      description: 'Display author bio and dates on this page',
      initialValue: false,
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      provider: 'provider',
      media: 'thumbnail',
    },
    prepare: ({ title, provider, media }) => ({
      title,
      subtitle: provider,
      media,
    }),
  },
})
