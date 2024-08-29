import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'

import AddDoc from '@/components/AddDoc'

export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className=' w-5/6'>
        Page for creating a new article

        <AddDoc />
      </div>
    </div>
  );
}
