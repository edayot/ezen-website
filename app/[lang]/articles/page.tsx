import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'
import { getDocs, query, collection, limit, orderBy, QueryDocumentSnapshot} from '@firebase/firestore';
import { db } from '@/utils/firebase';
import React from "react";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import Link from 'next/link';


function Element(doc: QueryDocumentSnapshot, lang: string) {
  const data = doc.data()
  const local_data = data[lang]
  return (
    <div key={data.date}>
      <Link href={`/article/${doc.id}`}>
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="text-tiny uppercase font-bold">{local_data.name}</div>
            <small className="text-default-500">{data.latin_name}</small>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="https://nextui.org/images/hero-card-complete.jpeg"
              width={270}
            />
          </CardBody>
        </Card>
      </Link>
    </div>
  )
}


export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  const ref = collection(db, "articles")
  let q = await getDocs(query(ref, orderBy("date"), limit(20)))

  // render all elements in the collection trought the Element function
  let elements = q.docs.map((doc) =>
    Element(doc, params.lang)
  )

  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className="w-5/6 max-w-4xl">
        <h1>Articles</h1>
        <div className='border flex'>
          {elements}
        </div>
      </div>
    </div>
  );
}
