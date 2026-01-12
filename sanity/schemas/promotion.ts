// Promotion Schema
// Full promotion pages with content, T&Cs, and categorization

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'promotion',
  title: 'Promotion',
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
      title: 'Promotion Title',
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
      name: 'promotionType',
      title: 'Promotion Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Competitions', value: 'competitions' },
          { title: 'Casino', value: 'casino' },
          { title: 'Live Games', value: 'live-games' },
          { title: 'Sports', value: 'sports' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flair',
      title: 'Flair/Tag',
      type: 'string',
      group: 'basic',
      description: 'Optional tag like "Hot", "New", "Limited Time", etc.',
    }),
    defineField({
      name: 'flairColor',
      title: 'Flair Color',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Yellow', value: 'yellow' },
        ],
        layout: 'radio',
      },
      initialValue: 'blue',
      hidden: ({ parent }) => !parent?.flair,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'basic',
      rows: 2,
      description: 'Short description shown on listing pages',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      group: 'basic',
      description: 'Link to the promotion on the main platform',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'basic',
      initialValue: 'Enter Now',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      group: 'basic',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      group: 'basic',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
      description: 'Inactive promotions will not be shown on the site',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Featured promotions appear more prominently',
    }),

    // Media
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      description: 'Main promotional banner image',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      description: 'Smaller image for listing pages (uses hero if not set)',
    }),

    // Content
    defineField({
      name: 'content',
      title: 'Content',
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
    defineField({
      name: 'termsAndConditions',
      title: 'Terms and Conditions',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description: 'Legal terms and conditions for the promotion',
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
  preview: {
    select: {
      title: 'title',
      type: 'promotionType',
      flair: 'flair',
      isActive: 'isActive',
      media: 'heroImage',
    },
    prepare: ({ title, type, flair, isActive, media }) => ({
      title,
      subtitle: `${type || 'No type'}${flair ? ` • ${flair}` : ''} ${isActive ? '🟢' : '🔴'}`,
      media,
    }),
  },
  orderings: [
    {
      title: 'Start Date, Newest',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
