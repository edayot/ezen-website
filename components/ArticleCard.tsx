"use client";
import {Card, CardHeader, CardBody, CardFooter, Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import {Image} from "@nextui-org/react";
import { motion } from "framer-motion";
import { PlantData } from "@/utils/article";
import { locales } from "@/langs";


export function Element({data, id, lang}: {data: PlantData, lang: typeof locales[number], id: string}) {
    const local_data = data[lang]
    const router = useRouter()

    const redirectToArticle = (event: any) => {
      console.log(`Redirecting to article ${id}`);
      router.push(`/article/${id}`);
    }
    let imageSrc = data.image ? data.image : "https://nextui.org/images/hero-card-complete.jpeg"

    let imageComponent = (
    <Image
        removeWrapper
        alt="Woman listing to music"
        className="z-0 w-72 object-cover"
        src={imageSrc}
        fallbackSrc="https://nextui.org/images/hero-card-complete.jpeg"
      />
    )

    return (
      <div key={data.date} className="">
        <motion.button whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.95 }} onClick={redirectToArticle}>
        <Card
          isFooterBlurred
          radius="lg"
          className="border-none"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/40 font-bold">{data.latin_name}</p>
            <h4 className="text-white/90 font-medium text-2xl text-wrap text-left">{data[lang].name}</h4>
          </CardHeader>
          {imageComponent}
          
        </Card>
        </motion.button>
      </div>
    )
  }