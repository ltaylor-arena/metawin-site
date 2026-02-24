// Blog Settings Schema
// Blog homepage content and navigation configuration

import { defineType, defineField } from 'sanity'
import { richTextBlockSimple } from './richTextBlock'

export default defineType({
  name: 'blogSettings',
  title: 'Blog Settings',
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
      initialValue: 'Blog Settings',
      hidden: true,
    }),

    // ===== HOMEPAGE =====

    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      group: 'homepage',
      description: 'Main heading for the blog homepage',
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
    defineField({
      name: 'heroCta',
      title: 'Hero CTA Button',
      type: 'object',
      group: 'homepage',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'string',
          description: 'URL or path (e.g., /blog/guides/)',
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

    // Featured Posts
    defineField({
      name: 'featuredPostsHeading',
      title: 'Featured Section Heading',
      type: 'string',
      group: 'homepage',
      initialValue: 'Featured Articles',
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured Posts',
      type: 'array',
      group: 'homepage',
      description: 'Manually select featured posts. Leave empty to auto-select posts marked as featured.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blogPost' }],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'featuredLimit',
      title: 'Featured Posts Limit',
      type: 'number',
      group: 'homepage',
      description: 'Max featured posts to show (default: 3)',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(6).integer(),
    }),

    // Latest Posts
    defineField({
      name: 'latestPostsHeading',
      title: 'Latest Posts Heading',
      type: 'string',
      group: 'homepage',
      initialValue: 'Latest Articles',
    }),
    defineField({
      name: 'showLatestPosts',
      title: 'Show Latest Posts',
      type: 'boolean',
      group: 'homepage',
      description: 'Display a grid of latest posts',
      initialValue: true,
    }),
    defineField({
      name: 'latestLimit',
      title: 'Latest Posts Limit',
      type: 'number',
      group: 'homepage',
      description: 'Number of latest posts to show (default: 6)',
      initialValue: 6,
      validation: (Rule) => Rule.min(3).max(12).integer(),
    }),

    // Category Sections
    defineField({
      name: 'showByCategory',
      title: 'Show Posts by Category',
      type: 'boolean',
      group: 'homepage',
      description: 'Display posts grouped by category on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'categoryPostsLimit',
      title: 'Posts Per Category',
      type: 'number',
      group: 'homepage',
      description: 'Number of posts to show per category section (default: 4)',
      initialValue: 4,
      hidden: ({ document }) => !document?.showByCategory,
    }),

    // ===== NAVIGATION =====

    defineField({
      name: 'navLogo',
      title: 'Blog Logo',
      type: 'image',
      group: 'navigation',
      description: 'Optional blog-specific logo for the navigation',
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
      description: 'URL for the home link (e.g., / or /blog/)',
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
          to: [{ type: 'blogCategory' }],
        },
      ],
    }),
    defineField({
      name: 'recentPostsLimit',
      title: 'Recent Posts in Nav',
      type: 'number',
      group: 'navigation',
      description: 'Number of recent posts to show in navigation dropdown (default: 5)',
      initialValue: 5,
      validation: (Rule) => Rule.min(0).max(10).integer(),
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
      description: 'SEO settings for the blog homepage',
    }),
  ],

  preview: {
    prepare: () => ({
      title: 'Blog Settings',
      subtitle: 'Homepage & Navigation',
    }),
  },
})
