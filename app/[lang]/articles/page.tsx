
import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'
import { getDocs, query, collection, limit, orderBy, QueryDocumentSnapshot} from '@firebase/firestore';
import { db } from '@/utils/firebase';
import React from "react";
import { Element } from '@/components/ArticleCard';





export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  const ref = collection(db, "articles")
  let q = await getDocs(query(ref, orderBy("date"), limit(20)))

  // render all elements in the collection trought the Element function
  let elements = q.docs.map((doc) =>
    <Element data={doc.data()} lang={params.lang} id={doc.id}/>
  )

  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className="w-11/12 max-w-9xl">
        <div className=' flex justify-center'><h1>{dict.articles.title}</h1></div>
        <br/>
        <div className='flex gap-2 flex-wrap justify-center'>
          {elements}
        </div>
      </div>
    </div>
  );
}
