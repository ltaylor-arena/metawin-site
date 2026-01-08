// Game Schema
// Individual game entries

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'game',
  title: 'Game',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Game Title',
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
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Game Provider',
      type: 'string',
      description: 'e.g., Pragmatic Play, NetEnt, Evolution',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
    }),
    defineField({
      name: 'rtp',
      title: 'RTP %',
      type: 'number',
      description: 'Return to Player percentage',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'volatility',
      title: 'Volatility',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
        ],
      },
    }),
    defineField({
      name: 'externalGameUrl',
      title: 'External Game URL',
      type: 'url',
      description: 'Link to play this game on the main platform',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Game',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      title: 'New Release',
      type: 'boolean',
      initialValue: false,
    }),
    
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      provider: 'provider',
      media: 'thumbnail',
    },
    prepare: ({ title, provider, media }) => ({
      title,
      subtitle: provider,
      media,
    }),
  },
})
