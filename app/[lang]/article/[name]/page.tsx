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
  const local_data = data[params.lang]


  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className="w-5/6 max-w-xl">
        <RenderArticle
          name={local_data.name}
          latin_name={data.latin_name}
          place={local_data.place}
          desc={local_data.desc}
          image={data.image}
        />
      </div>
    </div>
  );
}
