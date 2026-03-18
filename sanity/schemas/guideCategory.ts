// Guide Category Schema
// Categories for organizing guides (e.g., Getting Started, Payments, Game Mechanics)

import { defineType, defineField } from 'sanity'
import { richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'guideCategory',
  title: 'Guide Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief category description for the category page header',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Optional icon for navigation and category tags',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional hero image for the category page',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'array',
      of: [richTextBlockSimple],
      description: 'Rich text intro displayed above the guides grid',
    }),
    defineField({
      name: 'color',
      title: 'Tag Color',
      type: 'string',
      description: 'Hex color for category tags (e.g., #10B981)',
      validation: (Rule) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
          invert: false,
        }).warning('Should be a valid hex color like #10B981'),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in navigation',
    }),
    defineField({
      name: 'guidesPerPage',
      title: 'Guides Per Page',
      type: 'number',
      description: 'Number of guides to show per page (default: 12)',
      initialValue: 12,
      validation: (Rule) => Rule.min(6).max(24).integer(),
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Include this category in the guides navigation',
      initialValue: true,
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
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
      color: 'color',
    },
    prepare: ({ title, order, media, color }) => ({
      title,
      subtitle: `Order: ${order ?? 'Not set'}${color ? ` · ${color}` : ''}`,
      media,
    }),
  },
})
