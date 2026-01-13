// Page Schema
// Flexible page builder with modular content blocks

import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 2,
      description: 'Short intro text displayed below the page title',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      description: 'URL path for this page (e.g., "slots" becomes /casino/slots)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isHomepage',
      title: 'Is Homepage?',
      type: 'boolean',
      group: 'settings',
      description: 'Set this page as the /casino/ homepage',
      initialValue: false,
    }),

    // Authorship
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'settings',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'settings',
      description: 'Manually set when content is significantly updated',
    }),
    defineField({
      name: 'showAuthorInfo',
      title: 'Show Author Info',
      type: 'boolean',
      group: 'settings',
      description: 'Display author bio and dates on this page',
      initialValue: false,
    }),

    // Page Content Blocks
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      group: 'content',
      of: [
        // Hero / CTA Carousel
        defineArrayMember({
          type: 'hero',
          title: 'Hero / Promo Carousel',
        }),
        
        // Intro Section
        defineArrayMember({
          type: 'object',
          name: 'introSection',
          title: 'Intro Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading (H1)',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Intro Text',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'promoCards',
              title: 'Promo Cards (Right Column)',
              description: 'Optional: Add 2 promotional cards to display in a right column (40% width on desktop)',
              type: 'array',
              of: [{ type: 'promoCard' }],
              validation: (Rule) => Rule.max(2),
            }),
          ],
          preview: {
            select: { title: 'heading', promoCards: 'promoCards' },
            prepare: ({ title, promoCards }) => ({
              title: title || 'Intro Section',
              subtitle: promoCards?.length ? `Heading & Text + ${promoCards.length} promo cards` : 'Heading & Text',
            }),
          },
        }),
        
        // Game Carousel
        defineArrayMember({
          type: 'gameCarousel',
          title: 'Game Carousel',
        }),
        
        // Tab Section
        defineArrayMember({
          type: 'object',
          name: 'tabSection',
          title: 'Tab Section',
          fields: [
            defineField({
              name: 'tabs',
              title: 'Tabs',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'tab',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Tab Label',
                      type: 'string',
                    }),
                    defineField({
                      name: 'content',
                      title: 'Tab Content',
                      type: 'array',
                      of: [{ type: 'block' }],
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { tabs: 'tabs' },
            prepare: ({ tabs }) => ({
              title: 'Tab Section',
              subtitle: `${tabs?.length || 0} tabs`,
            }),
          },
        }),
        
        // Rich Text Block
        defineArrayMember({
          type: 'object',
          name: 'richText',
          title: 'Rich Text',
          fields: [
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' },
              ],
            }),
          ],
          preview: {
            prepare: () => ({
              title: 'Rich Text Block',
            }),
          },
        }),
        
        // CTA Banner
        defineArrayMember({
          type: 'object',
          name: 'ctaBanner',
          title: 'CTA Banner',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
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
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare: ({ title }) => ({
              title: title || 'CTA Banner',
              subtitle: 'Call to Action',
            }),
          },
        }),

        // FAQ Section
        defineArrayMember({
          type: 'faq',
          title: 'FAQ Section',
        }),

        // Feature Cards
        defineArrayMember({
          type: 'featureCards',
          title: 'Feature Cards',
        }),
      ],
    }),
    
    // SEO Fields
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),

    // Structured Data
    defineField({
      name: 'organizationSchema',
      title: 'Organization Schema',
      type: 'organizationSchema',
      group: 'seo',
      description: 'Add Organization structured data to this page (typically only needed on homepage)',
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      isHomepage: 'isHomepage',
    },
    prepare: ({ title, slug, isHomepage }) => ({
      title: title,
      subtitle: isHomepage ? '🏠 Homepage' : `/casino/${slug}`,
    }),
  },
})
