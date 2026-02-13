// Rich Text Block Definition
// Reusable Portable Text block configuration with custom link annotation
// Use this across all schemas for consistent rich text editing

import { defineField } from 'sanity'

// Link annotation definition (inline for Portable Text compatibility)
const linkAnnotation = {
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    {
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal (Document)', value: 'internal' },
          { title: 'External (URL)', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
    },
    // Internal link - document reference
    {
      name: 'reference',
      title: 'Document',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'game' },
        { type: 'category' },
        { type: 'promotion' },
        { type: 'author' },
      ],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'internal',
    },
    // External link - URL
    {
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (Rule: any) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'external',
    },
    // External link options
    {
      name: 'nofollow',
      title: 'No Follow',
      type: 'boolean',
      description: 'Add rel="nofollow" for SEO (recommended for external links)',
      initialValue: true,
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'external',
    },
    {
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      description: 'Open link in a new browser tab',
      initialValue: true,
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'external',
    },
  ],
}

/**
 * Standard rich text block with custom internal/external link support.
 * Use this in any 'array' field that needs rich text with links.
 *
 * Example usage:
 * defineField({
 *   name: 'content',
 *   type: 'array',
 *   of: [richTextBlock],
 * })
 */
export const richTextBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'H4', value: 'h4' },
    { title: 'Quote', value: 'blockquote' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Underline', value: 'underline' },
      { title: 'Strike', value: 'strike-through' },
      { title: 'Code', value: 'code' },
    ],
    annotations: [linkAnnotation],
  },
}

/**
 * Simplified rich text block without headings.
 * Use for inline content like callouts, summaries, etc.
 */
export const richTextBlockSimple = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [linkAnnotation],
  },
}

/**
 * Rich text block with images.
 * Use for full content areas that may include inline images.
 */
export const richTextBlockWithImages = [
  richTextBlock,
  {
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
      }),
      defineField({
        name: 'caption',
        title: 'Caption',
        type: 'string',
      }),
    ],
  },
]
