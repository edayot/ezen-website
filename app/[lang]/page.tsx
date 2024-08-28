import Image from "next/image";

import { getDictionary } from './dictionaries'


export default async function Home({ params: { lang } }) {
  const dict = await getDictionary(lang)
  console.log("dict", dict)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        CONTENT
      </div>
    </main>
  );
}
