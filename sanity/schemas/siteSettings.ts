// Site Settings Schema
// Global site configuration

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'MetaWin',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo Alt Text',
      type: 'string',
      initialValue: 'MetaWin',
    }),
    
    // Default SEO
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'titleTemplate',
          title: 'Title Template',
          type: 'string',
          description: 'Use %s for page title. e.g., "%s | MetaWin Casino"',
          initialValue: '%s | MetaWin Casino',
        }),
        defineField({
          name: 'defaultDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'defaultOgImage',
          title: 'Default Social Share Image',
          type: 'image',
        }),
      ],
    }),
    
    // External links (to main SPA)
    defineField({
      name: 'mainSiteUrl',
      title: 'Main Site URL',
      type: 'url',
      description: 'URL to the main MetaWin SPA (for "Play Now" buttons etc.)',
      initialValue: 'https://metawin.com',
    }),
    defineField({
      name: 'signInUrl',
      title: 'Sign In URL',
      type: 'string',
      initialValue: 'https://metawin.com/signin',
    }),
    defineField({
      name: 'signUpUrl',
      title: 'Sign Up URL',
      type: 'string',
      initialValue: 'https://metawin.com/signup',
    }),
    
    // Analytics
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      description: 'e.g., G-XXXXXXXXXX',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Site Settings',
    }),
  },
})
