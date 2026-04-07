import { NextResponse, type NextRequest } from 'next/server'

// Minimal middleware - no Supabase, no edge-incompatible imports
// Auth is handled entirely in (crm)/layout.tsx server component
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
