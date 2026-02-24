// Blog Post Schema
// Individual blog articles with hero image and author callout

import { defineType, defineField, defineArrayMember } from 'sanity'
import { richTextBlock, richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
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
      title: 'Post Title',
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
      description: 'Short summary for post cards and previews (max 200 chars)',
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
          to: [{ type: 'blogCategory' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Content
    defineField({
      name: 'content',
      title: 'Post Content',
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
          ],
        },
        // Callout
        defineArrayMember({
          type: 'callout',
          title: 'Callout',
        }),
      ],
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
      description: 'Display full author callout at bottom of post',
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
      description: 'Set when content is significantly updated',
    }),

    // Flags
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      group: 'settings',
      description: 'Show in featured section on blog homepage',
      initialValue: false,
    }),

    // Related Content
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      group: 'settings',
      description: 'Manual selection of related posts (optional)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blogPost' }],
        },
      ],
      validation: (Rule) => Rule.max(3),
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
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'heroImage',
      publishedAt: 'publishedAt',
      isFeatured: 'isFeatured',
    },
    prepare: ({ title, author, media, publishedAt, isFeatured }) => {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : 'Draft'
      return {
        title: `${isFeatured ? '⭐ ' : ''}${title}`,
        subtitle: `${author} · ${date}`,
        media,
      }
    },
  },
})
