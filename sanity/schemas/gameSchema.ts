// Game Schema for Structured Data
// Generates schema.org VideoGame/SoftwareApplication JSON-LD

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gameSchema',
  title: 'Game Schema',
  type: 'object',
  description: 'Structured data for this game (enhances search appearance)',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Game Schema',
      type: 'boolean',
      description: 'When enabled, generates structured data from game details. Fields below override auto-generated values.',
      initialValue: true,
    }),
    defineField({
      name: 'schemaType',
      title: 'Schema Type',
      type: 'string',
      description: 'The schema.org type to use',
      hidden: ({ parent }) => !parent?.enabled,
      options: {
        list: [
          { title: 'VideoGame (recommended)', value: 'VideoGame' },
          { title: 'SoftwareApplication', value: 'SoftwareApplication' },
        ],
      },
      initialValue: 'VideoGame',
    }),
    defineField({
      name: 'nameOverride',
      title: 'Name Override',
      type: 'string',
      description: 'Override the game title for schema (leave empty to use game title)',
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: 'descriptionOverride',
      title: 'Description Override',
      type: 'text',
      rows: 3,
      description: 'Override the description for schema (leave empty to auto-generate from content)',
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'array',
      description: 'Game genres (e.g., Slot, Table Game, Live Casino)',
      hidden: ({ parent }) => !parent?.enabled,
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'gamePlatform',
      title: 'Game Platform',
      type: 'array',
      description: 'Platforms where the game is available',
      hidden: ({ parent }) => !parent?.enabled,
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Web Browser', value: 'Web Browser' },
          { title: 'iOS', value: 'iOS' },
          { title: 'Android', value: 'Android' },
          { title: 'Windows', value: 'Windows' },
          { title: 'macOS', value: 'macOS' },
        ],
      },
      initialValue: ['Web Browser'],
    }),
    defineField({
      name: 'applicationCategory',
      title: 'Application Category',
      type: 'string',
      description: 'Category for SoftwareApplication schema',
      hidden: ({ parent }) => !parent?.enabled || parent?.schemaType !== 'SoftwareApplication',
      options: {
        list: [
          { title: 'Game', value: 'GameApplication' },
          { title: 'Entertainment', value: 'EntertainmentApplication' },
        ],
      },
      initialValue: 'GameApplication',
    }),
    defineField({
      name: 'operatingSystem',
      title: 'Operating System',
      type: 'string',
      description: 'OS requirements (for SoftwareApplication)',
      hidden: ({ parent }) => !parent?.enabled,
      initialValue: 'Any (Web Browser)',
    }),
    defineField({
      name: 'offers',
      title: 'Offers',
      type: 'object',
      description: 'Pricing information',
      hidden: ({ parent }) => !parent?.enabled,
      fields: [
        defineField({
          name: 'price',
          title: 'Price',
          type: 'string',
          description: 'Price to play (use "0" for free-to-play)',
          initialValue: '0',
        }),
        defineField({
          name: 'priceCurrency',
          title: 'Currency',
          type: 'string',
          initialValue: 'USD',
        }),
        defineField({
          name: 'availability',
          title: 'Availability',
          type: 'string',
          options: {
            list: [
              { title: 'In Stock', value: 'https://schema.org/InStock' },
              { title: 'Online Only', value: 'https://schema.org/OnlineOnly' },
            ],
          },
          initialValue: 'https://schema.org/OnlineOnly',
        }),
      ],
    }),
    defineField({
      name: 'aggregateRating',
      title: 'Aggregate Rating',
      type: 'object',
      description: 'Optional: Add rating information if available',
      hidden: ({ parent }) => !parent?.enabled,
      fields: [
        defineField({
          name: 'enabled',
          title: 'Include Rating',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'ratingValue',
          title: 'Rating Value',
          type: 'number',
          description: 'Average rating (e.g., 4.5)',
          hidden: ({ parent }) => !parent?.enabled,
          validation: (Rule) => Rule.min(1).max(5),
        }),
        defineField({
          name: 'bestRating',
          title: 'Best Rating',
          type: 'number',
          initialValue: 5,
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'ratingCount',
          title: 'Rating Count',
          type: 'number',
          description: 'Number of ratings',
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Game Provider/Author',
      type: 'object',
      description: 'Game provider information (auto-fills from provider field if empty)',
      hidden: ({ parent }) => !parent?.enabled,
      fields: [
        defineField({
          name: 'nameOverride',
          title: 'Provider Name Override',
          type: 'string',
          description: 'Leave empty to use the provider field',
        }),
        defineField({
          name: 'url',
          title: 'Provider URL',
          type: 'url',
          description: 'Link to the game provider website',
        }),
      ],
    }),
  ],
})
