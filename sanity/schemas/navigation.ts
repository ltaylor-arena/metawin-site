// Navigation Schema
// Configurable sidebar navigation with mixed items and sections

import { defineType, defineField } from 'sanity'
import { IconPicker } from '../components/IconPicker'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Navigation Name',
      type: 'string',
      description: 'Internal name (e.g., "Main Sidebar")',
    }),
    defineField({
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      description: 'Add links or collapsible sections in any order',
      of: [
        // Regular navigation item
        {
          type: 'object',
          name: 'navItem',
          title: 'Link',
          icon: () => '🔗',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              components: {
                input: IconPicker,
              },
            }),
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Internal Page', value: 'internal' },
                  { title: 'Category', value: 'category' },
                  { title: 'Game', value: 'game' },
                  { title: 'External URL', value: 'external' },
                ],
              },
              initialValue: 'internal',
            }),
            defineField({
              name: 'internalLink',
              title: 'Internal Page',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent?.linkType !== 'internal',
            }),
            defineField({
              name: 'categoryLink',
              title: 'Category',
              type: 'reference',
              to: [{ type: 'category' }],
              hidden: ({ parent }) => parent?.linkType !== 'category',
            }),
            defineField({
              name: 'gameLink',
              title: 'Game',
              type: 'reference',
              to: [{ type: 'game' }],
              hidden: ({ parent }) => parent?.linkType !== 'game',
            }),
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              hidden: ({ parent }) => parent?.linkType !== 'external',
            }),
            defineField({
              name: 'highlight',
              title: 'Highlight Style',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: 'none' },
                  { title: 'New', value: 'new' },
                  { title: 'Hot', value: 'hot' },
                  { title: 'Featured', value: 'featured' },
                ],
              },
              initialValue: 'none',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              icon: 'icon',
              highlight: 'highlight',
            },
            prepare: ({ title, icon, highlight }) => ({
              title: title || 'Untitled Link',
              subtitle: [icon ? `Icon: ${icon}` : null, highlight && highlight !== 'none' ? highlight.toUpperCase() : null].filter(Boolean).join(' • '),
            }),
          },
        },
        // Collapsible section
        {
          type: 'object',
          name: 'navSection',
          title: 'Section',
          icon: () => '📁',
          fields: [
            defineField({
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              description: 'e.g., "More", "VIP"',
            }),
            defineField({
              name: 'isCollapsible',
              title: 'Collapsible',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'defaultOpen',
              title: 'Open by Default',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'showDivider',
              title: 'Show Divider Above',
              type: 'boolean',
              description: 'Show a horizontal line above this section',
              initialValue: true,
            }),
            defineField({
              name: 'highlight',
              title: 'Highlight Style',
              type: 'string',
              description: 'Badge shown next to section title',
              options: {
                list: [
                  { title: 'None', value: 'none' },
                  { title: 'New', value: 'new' },
                  { title: 'Hot', value: 'hot' },
                  { title: 'Featured', value: 'featured' },
                ],
              },
              initialValue: 'none',
            }),
            defineField({
              name: 'items',
              title: 'Section Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'sectionNavItem',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                    }),
                    defineField({
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      components: {
                        input: IconPicker,
                      },
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Internal Page', value: 'internal' },
                          { title: 'Category', value: 'category' },
                          { title: 'Game', value: 'game' },
                          { title: 'External URL', value: 'external' },
                        ],
                      },
                      initialValue: 'internal',
                    }),
                    defineField({
                      name: 'internalLink',
                      title: 'Internal Page',
                      type: 'reference',
                      to: [{ type: 'page' }],
                      hidden: ({ parent }) => parent?.linkType !== 'internal',
                    }),
                    defineField({
                      name: 'categoryLink',
                      title: 'Category',
                      type: 'reference',
                      to: [{ type: 'category' }],
                      hidden: ({ parent }) => parent?.linkType !== 'category',
                    }),
                    defineField({
                      name: 'gameLink',
                      title: 'Game',
                      type: 'reference',
                      to: [{ type: 'game' }],
                      hidden: ({ parent }) => parent?.linkType !== 'game',
                    }),
                    defineField({
                      name: 'externalUrl',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({ parent }) => parent?.linkType !== 'external',
                    }),
                    defineField({
                      name: 'highlight',
                      title: 'Highlight Style',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'None', value: 'none' },
                          { title: 'New', value: 'new' },
                          { title: 'Hot', value: 'hot' },
                          { title: 'Featured', value: 'featured' },
                        ],
                      },
                      initialValue: 'none',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      linkType: 'linkType',
                      pageName: 'internalLink.title',
                      categoryName: 'categoryLink.title',
                      gameName: 'gameLink.title',
                    },
                    prepare: ({ title, linkType, pageName, categoryName, gameName }) => ({
                      title: title || pageName || categoryName || gameName || 'Untitled',
                      subtitle: linkType ? `${linkType} link` : undefined,
                    }),
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'sectionTitle', items: 'items', highlight: 'highlight' },
            prepare: ({ title, items, highlight }) => ({
              title: `📁 ${title || 'Untitled Section'}`,
              subtitle: [`${items?.length || 0} items`, highlight && highlight !== 'none' ? highlight.toUpperCase() : null].filter(Boolean).join(' • '),
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare: ({ title, items }) => ({
      title: title || 'Navigation',
      subtitle: `${items?.length || 0} items`,
    }),
  },
})
