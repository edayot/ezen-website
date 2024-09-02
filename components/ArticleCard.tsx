"use client";
import {Card, CardHeader, CardBody} from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import {Image} from "@nextui-org/react";
import { motion } from "framer-motion";


export function Element({data, id, lang}: {data: any, lang: string, id: string}) {
    const local_data = data[lang]
    const router = useRouter()

    const redirectToArticle = (event: any) => {
      console.log(`Redirecting to article ${id}`);
      router.push(`/article/${id}`);
    }
    return (
      <div key={data.date} className="min-w-fit">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={redirectToArticle}>
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
                height="auto"
              />
            </CardBody>
          </Card>
        </motion.button>
      </div>
    )
  }