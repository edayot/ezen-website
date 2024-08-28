import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'


export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        Article {params.name}
      </div>
    </main>
  );
}
