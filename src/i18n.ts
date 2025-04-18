import { getRequestConfig } from 'next-intl/server';

export const locales = ["en", "ja"] as const;
export const defaultLocale = "en" as const;

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));

export type Locale = (typeof locales)[number];
