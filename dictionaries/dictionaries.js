import 'server-only'

import { defaultLocale } from "@/langs";


export const getDictionary = async (locale) => {
  // check if the file exists
  let func = ''
  try {
    func = () => import(`@/dictionaries/${locale}.json`).then((module) => module.default);
    return await func()
  }
  catch (e) {
    console.warn(`File ${locale} not found, falling back to ${defaultLocale}`)
    func = () => import(`@/dictionaries/${defaultLocale}.json`).then((module) => module.default);
    return await func()
  }
}