import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'
import { getDoc, collection, doc, limit, orderBy, QueryDocumentSnapshot} from '@firebase/firestore';
import { db } from '@/utils/firebase';
import RenderArticle from '@/components/RenderArticle';
import { redirect } from 'next/navigation';


export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);

  const ref = collection(db, "articles")
  const document = await getDoc(doc(ref, params.name))
  const data = document.data()
  if (!data) {
    redirect('/404')
  }

  return (
    <RenderArticle
      data={data}
      lang={params.lang}
    />
  );
}
