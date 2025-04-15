import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default async function middleware(request) {
  const handler = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed'
  });
  return handler(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 