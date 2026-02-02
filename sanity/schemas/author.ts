// Author Schema
// Author profiles for content attribution

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g., "Casino Expert", "Content Writer", "Gaming Specialist"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      description: 'A short biography (2-3 sentences)',
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'e.g., "Slots", "Live Casino", "Crypto Gaming"',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        }),
        defineField({
          name: 'website',
          title: 'Personal Website',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'yearsInIndustry',
      title: 'Years in Industry',
      type: 'number',
      description: 'Number of years of experience in the gaming/casino industry',
      validation: (Rule) => Rule.min(0).max(50),
    }),
    defineField({
      name: 'favouriteGame',
      title: 'Favourite Game',
      type: 'reference',
      to: [{ type: 'game' }],
      description: 'Select the author\'s favourite game to feature on their profile',
    }),
    defineField({
      name: 'favouriteQuote',
      title: 'Favourite Quote',
      type: 'object',
      fields: [
        defineField({
          name: 'quote',
          title: 'Quote',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
          description: 'Who said this quote? (optional)',
        }),
      ],
    }),
    defineField({
      name: 'industryResources',
      title: 'Industry Resources',
      type: 'object',
      description: 'How does this author stay up to date with the industry?',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'How I Stay Up to Date',
        }),
        defineField({
          name: 'events',
          title: 'Events & Conferences',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'e.g., "ICE London", "SBC Summit", "G2E Las Vegas"',
        }),
        defineField({
          name: 'publications',
          title: 'Publications & News Sources',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'e.g., "iGaming Business", "Casino Beats", "EGR"',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
