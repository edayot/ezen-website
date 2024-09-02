"use client";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {QueryDocumentSnapshot} from '@firebase/firestore';


export function Element({data, id, lang}: {data: any, lang: string, id: string}) {
    const local_data = data[lang]
  
    const redirectToArticle = () => {
      redirect(`/article/${id}`)
    }
    return (
      <div key={data.date} className="min-w-fit">
          <Card className="py-4" onPressEnd={(e) => {redirect(`/article/${id}`)}}>
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
      </div>
    )
  }