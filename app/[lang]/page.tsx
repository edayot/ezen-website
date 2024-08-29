import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'


export default async function Home({ params }: { params: HomeProps })
{
  const dict = await getDictionary(params.lang);
  return (
    <>
      Home Page
    </>
  );
}
