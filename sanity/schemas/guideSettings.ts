// Guide Settings Schema
// Guides homepage content and navigation configuration

import { defineType, defineField } from 'sanity'
import { richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'guideSettings',
  title: 'Guide Settings',
  type: 'document',
  groups: [
    { name: 'homepage', title: 'Homepage', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Internal title for Sanity
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Guide Settings',
      hidden: true,
    }),

    // ===== HOMEPAGE =====

    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      group: 'homepage',
      description: 'Main heading for the guides homepage',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext',
      type: 'text',
      group: 'homepage',
      rows: 2,
      description: 'Tagline or subheading below the main heading',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'homepage',
      options: {
        hotspot: true,
      },
      description: 'Background or featured image for the hero section',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    // Intro Section
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'array',
      group: 'homepage',
      of: [richTextBlockSimple],
      description: 'Optional intro text below the hero',
    }),

    // Latest Guides
    defineField({
      name: 'latestGuidesHeading',
      title: 'Latest Guides Heading',
      type: 'string',
      group: 'homepage',
      initialValue: 'Recently Updated',
    }),
    defineField({
      name: 'showLatestGuides',
      title: 'Show Latest Guides',
      type: 'boolean',
      group: 'homepage',
      description: 'Display a grid of recently updated guides',
      initialValue: true,
    }),
    defineField({
      name: 'latestLimit',
      title: 'Latest Guides Limit',
      type: 'number',
      group: 'homepage',
      description: 'Number of latest guides to show (default: 6)',
      initialValue: 6,
      validation: (Rule) => Rule.min(3).max(12).integer(),
    }),

    // Category Sections
    defineField({
      name: 'showByCategory',
      title: 'Show Guides by Category',
      type: 'boolean',
      group: 'homepage',
      description: 'Display guides grouped by category on homepage',
      initialValue: true,
    }),
    defineField({
      name: 'categoryGuidesLimit',
      title: 'Guides Per Category',
      type: 'number',
      group: 'homepage',
      description: 'Number of guides to show per category section (default: 4)',
      initialValue: 4,
      hidden: ({ document }) => !document?.showByCategory,
    }),

    // ===== NAVIGATION =====

    defineField({
      name: 'navLogo',
      title: 'Guides Logo',
      type: 'image',
      group: 'navigation',
      description: 'Optional guides-specific logo for the navigation',
    }),
    defineField({
      name: 'navHomeLabel',
      title: 'Home Link Label',
      type: 'string',
      group: 'navigation',
      initialValue: 'Home',
    }),
    defineField({
      name: 'navHomeUrl',
      title: 'Home Link URL',
      type: 'string',
      group: 'navigation',
      description: 'URL for the home link (e.g., / or /guides/)',
      initialValue: '/',
    }),
    defineField({
      name: 'navCategories',
      title: 'Category Links',
      type: 'array',
      group: 'navigation',
      description: 'Select which categories appear in navigation. Leave empty to auto-include all categories with "Show in Nav" enabled.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'guideCategory' }],
        },
      ],
    }),
    defineField({
      name: 'navCta',
      title: 'CTA Button',
      type: 'object',
      group: 'navigation',
      description: 'Sign Up / Log In button',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Sign Up',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'string',
        }),
        defineField({
          name: 'secondaryText',
          title: 'Secondary Text',
          type: 'string',
          description: 'Optional secondary link text (e.g., "Log In")',
        }),
        defineField({
          name: 'secondaryLink',
          title: 'Secondary Link',
          type: 'string',
        }),
      ],
    }),

    // ===== SEO =====

    defineField({
      name: 'seo',
      title: 'Homepage SEO',
      type: 'seo',
      group: 'seo',
      description: 'SEO settings for the guides homepage',
    }),
  ],

  preview: {
    prepare: () => ({
      title: 'Guide Settings',
      subtitle: 'Homepage & Navigation',
    }),
  },
})
