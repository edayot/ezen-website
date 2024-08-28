import { getDictionary } from '@/dictionaries/dictionaries'

interface HomeProps {
  params: {
    lang: string;
  };
}

export default async function Home({ params: { lang } }: HomeProps) {
  const dict = await getDictionary(lang);
  console.log("dict", dict);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {dict.products.cart}
      </div>
    </main>
  );
}
