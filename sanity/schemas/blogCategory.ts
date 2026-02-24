// Blog Category Schema
// Categories for organizing blog posts

import { defineType, defineField } from 'sanity'
import { richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
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
      description: 'Rich text intro displayed above the posts grid',
    }),
    defineField({
      name: 'color',
      title: 'Tag Color',
      type: 'string',
      description: 'Hex color for category tags (e.g., #FF6B00)',
      validation: (Rule) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
          invert: false,
        }).warning('Should be a valid hex color like #FF6B00'),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in navigation',
    }),
    defineField({
      name: 'postsPerPage',
      title: 'Posts Per Page',
      type: 'number',
      description: 'Number of posts to show per page (default: 12)',
      initialValue: 12,
      validation: (Rule) => Rule.min(6).max(24).integer(),
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Include this category in the blog navigation',
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
