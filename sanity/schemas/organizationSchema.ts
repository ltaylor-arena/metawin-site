// Organization Schema for Structured Data
// Generates schema.org Organization JSON-LD

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'organizationSchema',
  title: 'Organization Schema',
  type: 'object',
  description: 'Structured data for your organization (appears in Google knowledge panel)',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Organization Schema',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      description: 'Legal or brand name of the organization',
      hidden: ({ parent }) => !parent?.enabled,
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { enabled?: boolean }
        if (parent?.enabled && !value) return 'Required when schema is enabled'
        return true
      }),
    }),
    defineField({
      name: 'legalName',
      title: 'Legal Name',
      type: 'string',
      description: 'Official registered legal name (if different from brand name)',
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
      description: 'Main website URL',
      hidden: ({ parent }) => !parent?.enabled,
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { enabled?: boolean }
        if (parent?.enabled && !value) return 'Required when schema is enabled'
        return true
      }),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Organization logo (recommended: 112x112px minimum, square)',
      hidden: ({ parent }) => !parent?.enabled,
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the organization',
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: 'foundingDate',
      title: 'Founding Date',
      type: 'date',
      description: 'When the organization was founded',
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: 'sameAs',
      title: 'Social Profiles',
      type: 'array',
      description: 'Links to official social media profiles',
      hidden: ({ parent }) => !parent?.enabled,
      of: [
        {
          type: 'object',
          name: 'socialProfile',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Discord', value: 'discord' },
                  { title: 'Telegram', value: 'telegram' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'Other', value: 'other' },
                ],
              },
            }),
            defineField({
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { platform: 'platform', url: 'url' },
            prepare: ({ platform, url }) => ({
              title: platform || 'Social Profile',
              subtitle: url,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'contactPoint',
      title: 'Contact Point',
      type: 'object',
      description: 'Customer service contact information',
      hidden: ({ parent }) => !parent?.enabled,
      fields: [
        defineField({
          name: 'contactType',
          title: 'Contact Type',
          type: 'string',
          options: {
            list: [
              { title: 'Customer Service', value: 'customer service' },
              { title: 'Technical Support', value: 'technical support' },
              { title: 'Sales', value: 'sales' },
              { title: 'Billing Support', value: 'billing support' },
            ],
          },
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
        defineField({
          name: 'url',
          title: 'Contact URL',
          type: 'url',
          description: 'Link to contact page or help center',
        }),
        defineField({
          name: 'availableLanguage',
          title: 'Available Languages',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
        }),
      ],
    }),
  ],
})
