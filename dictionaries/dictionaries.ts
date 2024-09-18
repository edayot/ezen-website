import "server-only";

import { defaultLocale, locales } from "@/langs";

import {readFile} from 'fs/promises'
import JSON5 from 'json5'

async function loadJSON5(filename: string) {
  const json5 = await readFile(process.cwd() + filename, 'utf8')
  return JSON5.parse(json5)
}

export interface HomeProps {
  lang: (typeof locales)[number];
  name: string;
  bypass: boolean;
}

function getDictionaryInternal(locale: string) {
  try {
    return loadJSON5(`/dictionaries/${locale}.jsonc`)
  } catch (e) {
    console.warn(`File ${locale} not found, falling back to ${defaultLocale}`);
    return loadJSON5(`/dictionaries/${defaultLocale}.json`)
  }
}

export const getDictionary = async (locale: string) => {
  // get the default dictionary and merge it with the locale dictionary
  const dict = await getDictionaryInternal(locale);
  const defaultDict = await getDictionaryInternal(defaultLocale);
  return { ...defaultDict, ...dict };
};
