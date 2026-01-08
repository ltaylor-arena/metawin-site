// Sanity Schema Index
// Export all schemas for registration

import page from './page'
import seo from './seo'
import hero from './hero'
import gameCarousel from './gameCarousel'
import game from './game'
import category from './category'
import promo from './promo'
import navigation from './navigation'
import footer from './footer'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Documents
  page,
  game,
  category,
  promo,
  siteSettings,
  navigation,
  footer,
  
  // Objects (reusable components)
  seo,
  hero,
  gameCarousel,
]
