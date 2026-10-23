import { createServerClient } from '@supabase/ssr'

import { NextResponse, type NextRequest } from 'next/server'
import path from 'path'

export async function updateSession(request: NextRequest) {

  let supabaseResponse = NextResponse.next({

    request,

  })

  // With Fluid compute, don't put this client in a global environment

  // variable. Always create a new one on each request.

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
         cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )
  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  const pathname = request.nextUrl.pathname
  console.log(JSON.stringify({ user: user ? user.email : null, origin: request.nextUrl.origin, path: pathname })) // log the user and the path they're trying to access
  // redirects carry over any refreshed auth cookies
  const go = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = ''
    const res = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => res.cookies.set(c))
    return res
  }
  if (!user && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) return go('/admin/login')
  if (pathname === '/admin' || pathname === '/admin/') return go(user ? '/admin/dashboard' : '/admin/login')
  if (user && pathname === '/admin/login') return go('/admin/dashboard')

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're

  // creating a new response object with NextResponse.next() make sure to:

  // 1. Pass the request in it, like so:

  //    const myNewResponse = NextResponse.next({ request })

  // 2. Copy over the cookies, like so:

  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())

  // 3. Change the myNewResponse object to fit your needs, but avoid changing

  //    the cookies!

  // 4. Finally:

  //    return myNewResponse

  // If this is not done, you may be causing the browser and server to go out

  // of sync and terminate the user's session prematurely!

  return supabaseResponse

}