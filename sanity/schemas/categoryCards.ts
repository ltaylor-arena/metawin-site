// Category Cards Schema
// Large promotional cards with images, titles, descriptions and CTAs

import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'categoryCards',
  title: 'Category Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Optional heading above the cards',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      rows: 2,
      description: 'Optional short description below the heading',
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'categoryCard',
          title: 'Category Card',
          fields: [
            defineField({
              name: 'image',
              title: 'Card Image',
              type: 'image',
              description: 'Image for the card (4:3 aspect ratio recommended)',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Card title (e.g., "Casino", "Prizes", "Sports")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Optional short description text',
            }),
            defineField({
              name: 'ctaText',
              title: 'Button Text',
              type: 'string',
              description: 'CTA button label',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ctaLink',
              title: 'Button Link',
              type: 'string',
              description: 'URL or internal path (internal links must end with /)',
              validation: (Rule) => [
                Rule.required(),
                Rule.custom((value) => {
                  if (!value) return true
                  if (value.startsWith('/') && !value.endsWith('/')) {
                    return 'Internal URLs must end with a trailing slash (e.g., /casino/)'
                  }
                  return true
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare: ({ title, media }) => ({
              title: title || 'Untitled Card',
              media: media,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      cards: 'cards',
    },
    prepare: ({ heading, cards }) => ({
      title: heading || 'Category Cards',
      subtitle: `${cards?.length || 0} cards`,
    }),
  },
})
