// Hero / Promo Carousel Schema
// Configurable carousel for hero banners and promos

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero / Promo Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'slide',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'ctaText',
              title: 'CTA Button Text',
              type: 'string',
            }),
            defineField({
              name: 'ctaLink',
              title: 'CTA Button Link',
              type: 'string',
              description: 'Internal links must end with /',
              validation: (Rule) => Rule.custom((value) => {
                if (!value) return true
                if (value.startsWith('/') && !value.endsWith('/')) {
                  return 'Internal URLs must end with a trailing slash'
                }
                return true
              }),
            }),
            defineField({
              name: 'internalLink',
              title: 'Or Internal Link',
              type: 'reference',
              to: [{ type: 'page' }, { type: 'game' }, { type: 'category' }],
              description: 'Link to an internal page instead of external URL',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error('Add at least one slide'),
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'autoplaySpeed',
      title: 'Autoplay Speed (seconds)',
      type: 'number',
      initialValue: 5,
      hidden: ({ parent }) => !parent?.autoplay,
    }),
  ],
  preview: {
    select: {
      slides: 'slides',
    },
    prepare: ({ slides }) => ({
      title: 'Hero Carousel',
      subtitle: `${slides?.length || 0} slides`,
    }),
  },
})
