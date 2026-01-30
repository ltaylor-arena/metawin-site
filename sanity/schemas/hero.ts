// Hero Schema
// Full-width hero carousel with background images and editable slides

import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      description: 'Automatically cycle through slides',
      initialValue: true,
    }),
    defineField({
      name: 'autoplaySpeed',
      title: 'Autoplay Speed (ms)',
      type: 'number',
      description: 'Time between slides in milliseconds',
      initialValue: 5000,
      hidden: ({ parent }) => !parent?.autoplay,
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroSlide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'desktopImage',
              title: 'Desktop Background Image',
              type: 'image',
              description: 'Background image for desktop (recommended: 1920x400px)',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'mobileImage',
              title: 'Mobile Background Image',
              type: 'image',
              description: 'Background image for mobile (recommended: 750x500px, square-ish)',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow Text',
              type: 'string',
              description: 'Small text above the headline (e.g., "Welcome to MetaWin")',
              initialValue: 'Welcome to MetaWin',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Main headline text',
            }),
            defineField({
              name: 'ctaText',
              title: 'CTA Button Text',
              type: 'string',
              initialValue: 'Sign In',
            }),
            defineField({
              name: 'ctaLink',
              title: 'CTA Button Link',
              type: 'string',
              description: 'External URL or internal path',
              initialValue: 'https://metawin.com/signin',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              media: 'desktopImage',
            },
            prepare: ({ title, media }) => ({
              title: title || 'Untitled Slide',
              media: media,
            }),
          },
        }),
      ],
      // validation: (Rule) => Rule.min(1),
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
