// Sanity Schema Index
// Export all schemas for registration

import page from './page'
import seo from './seo'
import hero from './hero'
import gameCarousel from './gameCarousel'
import faq from './faq'
import featureCards from './featureCards'
import promoCard from './promoCard'
import game from './game'
import category from './category'
import navigation from './navigation'
import footer from './footer'
import siteSettings from './siteSettings'
import author from './author'
import promotion from './promotion'
import organizationSchema from './organizationSchema'
import gameSchema from './gameSchema'
import callout from './callout'
import categoryCards from './categoryCards'
import {
  gameQuickSummary,
  gameProsAndCons,
  gameRichText,
  gameAuthorThoughts,
} from './gameContentBlocks'

export const schemaTypes = [
  // Documents
  page,
  game,
  category,
  promotion,
  author,
  siteSettings,
  navigation,
  footer,

  // Objects (reusable components)
  seo,
  hero,
  gameCarousel,
  faq,
  featureCards,
  promoCard,
  organizationSchema,
  gameSchema,
  callout,
  categoryCards,

  // Game content blocks (reorderable middle section)
  gameQuickSummary,
  gameProsAndCons,
  gameRichText,
  gameAuthorThoughts,
]
