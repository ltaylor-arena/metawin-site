// Game Category Schema
// Game categories (Slots, Live Casino, Blackjack, etc.)

import { defineType, defineField } from 'sanity'
import { richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'category',
  title: 'Game Category',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'h1',
      title: 'Page Heading (H1)',
      type: 'string',
      group: 'content',
      description: 'Custom H1 for the category page. If empty, uses Category Title.',
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
      name: 'icon',
      title: 'Icon',
      type: 'image',
      group: 'basic',
      description: 'Category icon for navigation',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      group: 'basic',
      rows: 2,
      description: 'Brief intro shown below the page title',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'basic',
      description: 'Lower numbers appear first in navigation',
    }),
    defineField({
      name: 'gamesPerPage',
      title: 'Games Per Page',
      type: 'number',
      group: 'basic',
      description: 'Number of games to show per page (default: 24)',
      initialValue: 24,
      validation: (Rule) => Rule.min(6).max(60).integer(),
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
    }),
    defineField({
      name: 'hideFromGamesIndex',
      title: 'Hide from Games Index',
      type: 'boolean',
      group: 'basic',
      description: 'Hide this category carousel from /casino/games/',
      initialValue: false,
    }),

    // Content Blocks (reorderable)
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      group: 'content',
      description: 'Drag and drop to reorder these content blocks. Displayed below the games grid on page 1.',
      of: [
        // Rich Text
        {
          type: 'gameRichText',
          title: 'Rich Text',
        },
        // Author's Thoughts
        {
          type: 'gameAuthorThoughts',
          title: "Author's Thoughts",
        },
        // Callout
        {
          type: 'callout',
          title: 'Callout',
        },
        // Data Table
        {
          type: 'gameTable',
          title: 'Data Table',
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

    // Authorship
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'factChecker',
      title: 'Fact Checked By',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
      description: 'Optional: Select an author who fact-checked this content',
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
    }),
    defineField({
      name: 'showAuthorInfo',
      title: 'Show Author Info',
      type: 'boolean',
      group: 'content',
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
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      media: 'icon',
    },
    prepare: ({ title, order, media }) => ({
      title,
      subtitle: `Order: ${order ?? 'Not set'}`,
      media,
    }),
  },
})
