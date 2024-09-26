import "server-only";

import { defaultLocale, locales } from "@/utils/langs";

export interface HomeProps {
  lang: (typeof locales)[number];
  name: string;
  bypass: boolean;
}

function getDictionaryInternal(locale: string) {
  try {
    return import(`@/dictionaries/${locale}.json`).then(
      (module) => module.default,
    );
  } catch (e) {
    console.warn(`File ${locale} not found, falling back to ${defaultLocale}`);
    return import(`@/dictionaries/${defaultLocale}.json`).then(
      (module) => module.default,
    );
  }
}

export const getDictionary = async (locale: string) => {
  // get the default dictionary and merge it with the locale dictionary
  const dict = await getDictionaryInternal(locale);
  const defaultDict = await getDictionaryInternal(defaultLocale);
  return { ...defaultDict, ...dict };
};
