import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'
import {LoginComponent} from '@/components/login/LoginComponent'



export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  return (
    <>
      <div className="flex flex-row min-h-screen justify-center">
        <div className="w-5/6 max-w-xl">
          <LoginComponent dict={dict} />
        </div>
      </div>
    </>
  );
}
