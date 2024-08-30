import { NextRequest, NextResponse } from "next/server";
import Negotiator from 'negotiator';
import { match } from "@formatjs/intl-localematcher";

import { locales, defaultLocale } from "./langs";

 
// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    let localeCookie = request.cookies.get('NEXT_LOCALE');
    if (localeCookie) {
        return localeCookie.value;
    }
    let headers: any = { 'accept-language': request.headers.get('accept-language') };
    let languages = new Negotiator({ headers }).languages()
    return match(languages, locales, defaultLocale);

 }
 
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
   
  if (pathnameHasLocale) return NextResponse.next()
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // '/:path*',
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}