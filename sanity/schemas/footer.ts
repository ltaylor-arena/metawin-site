// Footer Schema
// Site footer configuration

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Footer Name',
      type: 'string',
      description: 'Internal reference name',
      initialValue: 'Main Footer',
    }),
    
    // Footer columns
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({
              name: 'heading',
              title: 'Column Heading',
              type: 'string',
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'footerLink',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                    }),
                    defineField({
                      name: 'url',
                      title: 'URL',
                      type: 'string',
                    }),
                    defineField({
                      name: 'internalLink',
                      title: 'Or Internal Link',
                      type: 'reference',
                      to: [{ type: 'page' }],
                    }),
                    defineField({
                      name: 'openInNewTab',
                      title: 'Open in New Tab',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: { title: 'label' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'heading', links: 'links' },
            prepare: ({ title, links }) => ({
              title: title || 'Untitled Column',
              subtitle: `${links?.length || 0} links`,
            }),
          },
        },
      ],
    }),
    
    // Legal text
    defineField({
      name: 'legalText',
      title: 'Legal / Disclaimer Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    
    // Copyright
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Use {year} for dynamic year',
      initialValue: '© {year} MetaWin. All rights reserved.',
    }),
    
    // Social links
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Twitter / X', value: 'twitter' },
                  { title: 'Discord', value: 'discord' },
                  { title: 'Telegram', value: 'telegram' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                ],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'platform', url: 'url' },
            prepare: ({ title }) => ({
              title: title || 'Social Link',
            }),
          },
        },
      ],
    }),
    
    // Badges / Certifications
    defineField({
      name: 'badges',
      title: 'Trust Badges / Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'badge',
          fields: [
            defineField({
              name: 'image',
              title: 'Badge Image',
              type: 'image',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'url',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
