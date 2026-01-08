// Middleware for handling CloudFront proxy requests
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  
  // Log for debugging (remove in production or use proper logging)
  if (process.env.NODE_ENV === 'development' && forwardedHost) {
    console.log(`[Middleware] Request via proxy: ${forwardedHost}`)
  }
  
  const response = NextResponse.next()
  
  // Add any response headers if needed
  // response.headers.set('x-custom-header', 'value')
  
  return response
}

// Only run middleware on casino routes
export const config = {
  matcher: '/casino/:path*',
}
