import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'


export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border bg-slate-400 h-20">
        <input type="text" placeholder="Username" className="mb-4" />
        <input type="password" placeholder="Password" className="mb-4" />
      </div>
    </main>
  );
}
