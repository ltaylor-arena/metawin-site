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
      name: 'h1',
      title: 'Page Heading (H1)',
      type: 'string',
      group: 'content',
      description: 'Custom H1 for the page. If empty, uses Page Title.',
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
      name: 'factChecker',
      title: 'Fact Checked By',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'settings',
      description: 'Optional: Select an author who fact-checked this content',
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
              description: 'Optional: Add up to 3 promotional cards to display in a right column on desktop, stacked on mobile',
              type: 'array',
              of: [{ type: 'promoCard' }],
              validation: (Rule) => Rule.max(3),
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
            defineField({
              name: 'maxLines',
              title: 'Max Lines Before Collapse',
              type: 'number',
              description: 'Number of lines to show before "Read More" button. Set to 0 or leave empty to show all content.',
              initialValue: 6,
              validation: (Rule) => Rule.min(0).integer(),
            }),
          ],
          preview: {
            select: { maxLines: 'maxLines' },
            prepare: ({ maxLines }) => ({
              title: 'Rich Text Block',
              subtitle: maxLines ? `Collapses after ${maxLines} lines` : 'Full content',
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

        // Author's Thoughts
        defineArrayMember({
          type: 'gameAuthorThoughts',
          title: "Author's Thoughts",
        }),

        // Callout
        defineArrayMember({
          type: 'callout',
          title: 'Callout',
        }),

        // Category Cards (large promo cards with character images)
        defineArrayMember({
          type: 'categoryCards',
          title: 'Category Cards',
        }),

        // Hot & Cold Slots (Live RTP Tracker)
        defineArrayMember({
          type: 'object',
          name: 'hotColdSlots',
          title: 'Hot & Cold Slots',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              initialValue: 'Live RTP Tracker',
            }),
            defineField({
              name: 'hotTitle',
              title: 'Hot Table Title',
              type: 'string',
              initialValue: 'Hot Games',
            }),
            defineField({
              name: 'coldTitle',
              title: 'Cold Table Title',
              type: 'string',
              initialValue: 'Cold Games',
            }),
            defineField({
              name: 'limit',
              title: 'Games Per Table',
              type: 'number',
              initialValue: 10,
              validation: (Rule) => Rule.min(1).max(20),
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare: ({ title }) => ({
              title: title || 'Hot & Cold Slots',
              subtitle: 'Live RTP Tracker - fetches real-time data',
            }),
          },
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
