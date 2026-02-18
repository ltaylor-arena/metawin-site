// Sitemap Revalidation Webhook
// Called by Sanity webhook when content with content[] is published
// Regenerates sitemaps in the background

import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const secret = request.headers.get('x-sanity-webhook-secret')
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET

  if (!expectedSecret) {
    console.error('SANITY_WEBHOOK_SECRET not configured')
    return Response.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  if (secret !== expectedSecret) {
    console.warn('Invalid webhook secret received')
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Parse the webhook body to log what changed
    let body: { _type?: string; _id?: string } = {}
    try {
      body = await request.json()
    } catch {
      // Body parsing is optional
    }

    console.log(`Sitemap revalidation triggered for: ${body._type || 'unknown'} (${body._id || 'no id'})`)

    // Revalidate sitemap paths - this triggers background regeneration
    revalidatePath('/sitemap.xml', 'page')
    revalidatePath('/sitemap-images.xml', 'page')

    return Response.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      contentType: body._type || 'unknown',
    })
  } catch (error) {
    console.error('Sitemap revalidation error:', error)
    return Response.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
