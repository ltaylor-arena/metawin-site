// Promo Schema
// Promotional content for carousels and banners

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'promo',
  title: 'Promo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Promo Title',
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
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short promotional text',
    }),
    defineField({
      name: 'image',
      title: 'Promo Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'url',
    }),
    defineField({
      name: 'internalLink',
      title: 'Or Internal Link',
      type: 'reference',
      to: [{ type: 'page' }],
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      isActive: 'isActive',
    },
    prepare: ({ title, media, isActive }) => ({
      title,
      subtitle: isActive ? '🟢 Active' : '🔴 Inactive',
      media,
    }),
  },
})
