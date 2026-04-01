// Guide Schema
// Evergreen wiki-style guides for player education (how-to, explainers, etc.)

import { defineType, defineField, defineArrayMember } from 'sanity'
import { richTextBlock, richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'settings', title: 'Settings' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Guide Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short summary for guide cards and previews (max 200 chars)',
      validation: (Rule) => Rule.max(200),
    }),

    // Hero Image
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      description: 'Optional — guides can work without a hero image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional image credit or caption',
        }),
      ],
    }),

    // Categories
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'settings',
      of: [
        {
          type: 'reference',
          to: [{ type: 'guideCategory' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Content
    defineField({
      name: 'content',
      title: 'Guide Content',
      type: 'array',
      group: 'content',
      of: [
        // Rich text blocks
        richTextBlock,
        // Images
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
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Framed (default)', value: 'framed' },
                  { title: 'Full Width (no frame)', value: 'full-width' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'framed',
            }),
          ],
        },
        // Callout
        defineArrayMember({
          type: 'callout',
          title: 'Callout',
        }),
        // Data Table
        defineArrayMember({
          type: 'gameTable',
          title: 'Data Table',
        }),
      ],
    }),

    // FAQ
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
              of: [richTextBlockSimple],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),

    // Difficulty Level
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'beginner',
    }),

    // Estimated Reading Time
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      group: 'settings',
      description: 'Estimated reading time in minutes',
      validation: (Rule) => Rule.min(1).max(60).integer(),
    }),

    // Table of Contents
    defineField({
      name: 'showToc',
      title: 'Show Table of Contents',
      type: 'boolean',
      group: 'settings',
      description: 'Auto-generate TOC from H2 headings',
      initialValue: true,
    }),

    // Authorship
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'settings',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'factChecker',
      title: 'Fact Checked By',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'settings',
      description: 'Optional: Select an author who fact-checked this content',
    }),
    defineField({
      name: 'showAuthorBio',
      title: 'Show Author Bio',
      type: 'boolean',
      group: 'settings',
      description: 'Display full author callout at bottom of guide',
      initialValue: true,
    }),

    // Dates
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'settings',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'settings',
      description: 'Set when content is significantly updated — shown prominently on evergreen guides',
    }),

    // Related Content
    defineField({
      name: 'relatedGuides',
      title: 'Related Guides',
      type: 'array',
      group: 'settings',
      description: 'Link to related guides for cross-navigation',
      of: [
        {
          type: 'reference',
          to: [{ type: 'guide' }],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'relatedGames',
      title: 'Related Games',
      type: 'array',
      group: 'settings',
      description: 'Link to related game reviews (optional)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'game' }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),
  ],

  orderings: [
    {
      title: 'Last Updated',
      name: 'updatedAtDesc',
      by: [{ field: 'updatedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'heroImage',
      difficulty: 'difficulty',
      updatedAt: 'updatedAt',
    },
    prepare: ({ title, author, media, difficulty, updatedAt }) => {
      const date = updatedAt
        ? `Updated ${new Date(updatedAt).toLocaleDateString()}`
        : 'Not updated'
      const level = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : ''
      return {
        title,
        subtitle: `${level ? `${level} · ` : ''}${author} · ${date}`,
        media,
      }
    },
  },
})
