// Promo Card Schema
// Promotional card with background image, text and link

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'promoCard',
  title: 'Promo Card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Large text displayed on the card (e.g., "Casino", "Prizes")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Optional description text below the title (1-2 sentences)',
    }),
    defineField({
      name: 'colorTheme',
      title: 'Color Theme',
      type: 'string',
      description: 'Gradient color for the card overlay',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Orange', value: 'orange' },
          { title: 'Purple', value: 'purple' },
          { title: 'Green', value: 'green' },
          { title: 'Pink', value: 'pink' },
        ],
      },
      initialValue: 'blue',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'URL to navigate to when clicked (internal links must end with /)',
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value) => {
          if (!value) return true
          // For internal URLs (starting with /), enforce trailing slash
          if (value.startsWith('/') && !value.endsWith('/')) {
            return 'Internal URLs must end with a trailing slash (e.g., /casino/slots/)'
          }
          return true
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      colorTheme: 'colorTheme',
      media: 'backgroundImage',
    },
    prepare: ({ title, colorTheme, media }) => ({
      title: title,
      subtitle: colorTheme ? `Theme: ${colorTheme}` : undefined,
      media: media,
    }),
  },
})
