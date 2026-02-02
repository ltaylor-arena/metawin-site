// Game Schema
// Individual game entries with reorderable content blocks

import React from 'react'
import { defineType, defineField, defineArrayMember } from 'sanity'

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
      name: 'metawinId',
      title: 'MetaWin Game ID',
      type: 'number',
      group: 'basic',
      description: 'Internal ID from MetaWin platform. Set manually or auto-populated during import.',
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
    defineField({
      name: 'isPopular',
      title: 'Popular Game',
      type: 'boolean',
      group: 'basic',
      description: 'Games from the Popular collection on MetaWin',
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
          { title: 'Low-Medium', value: 'low-medium' },
          { title: 'Medium', value: 'medium' },
          { title: 'Medium-High', value: 'medium-high' },
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
      description: 'Upload a custom thumbnail, or use External Thumbnail URL below',
    }),
    defineField({
      name: 'externalThumbnailUrl',
      title: 'External Thumbnail URL',
      type: 'url',
      group: 'media',
      description: 'CDN URL for game thumbnail (used if no uploaded image). Auto-populated during import.',
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

    // Content Blocks (reorderable middle section)
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      group: 'content',
      description: 'Drag and drop to reorder these content blocks. Screenshots/CTA are always at top, FAQ/Author/Provider games are always at bottom.',
      of: [
        // Quick Summary
        defineArrayMember({
          type: 'gameQuickSummary',
          title: 'Quick Summary',
        }),

        // Pros and Cons
        defineArrayMember({
          type: 'gameProsAndCons',
          title: 'Pros and Cons',
        }),

        // Rich Text
        defineArrayMember({
          type: 'gameRichText',
          title: 'Rich Text',
        }),

        // Author's Thoughts
        defineArrayMember({
          type: 'gameAuthorThoughts',
          title: "Author's Thoughts",
        }),

        // Callout
        defineArrayMember({
          type: 'callout',
          title: 'Callout',
        }),
      ],
    }),

    // FAQ (fixed at bottom)
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'content',
      description: 'FAQ section - always displayed after content blocks',
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

    // Structured Data
    defineField({
      name: 'gameSchema',
      title: 'Game Schema',
      type: 'gameSchema',
      group: 'seo',
      description: 'Structured data settings for this game (auto-generates from game details)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      provider: 'provider',
      media: 'thumbnail',
      externalThumbnailUrl: 'externalThumbnailUrl',
    },
    prepare: ({ title, provider, media, externalThumbnailUrl }) => ({
      title,
      subtitle: provider,
      // Use Sanity image if available, otherwise show external URL as image
      media: media || (externalThumbnailUrl
        ? React.createElement('img', {
            src: externalThumbnailUrl,
            alt: title || 'Game thumbnail',
            style: { width: '100%', height: '100%', objectFit: 'cover' },
          })
        : undefined),
    }),
  },
})
