"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Pagination,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import { PlantData } from "@/utils/article";
import { locales } from "@/langs";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { FiSearch, FiArrowDown, FiArrowUp} from "react-icons/fi";
import { NewArticle } from "./RedirectButton";
import Link from "next/link";

import {
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  where,
  endAt,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { db } from "@/utils/firebase";


function appplySearchParam(searchParams: URLSearchParams, name: string, value: string) {
  const params = new URLSearchParams(searchParams.toString())
  params.set(name, value)

  return params.toString()
}



export function SearchBar({initValue, initSortDirection}: {initValue?: string, initSortDirection?: string}) {
  const [value, setValue] = useState(initValue || '');
  const [AscOrDesc, setAscOrDesc] = useState(initSortDirection || 'asc');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      return appplySearchParam(searchParams, name, value)
    },
    [searchParams]
  )
  const handleChange = (value: string) => {
    setValue(value);
    router.push(pathname + '?' + createQueryString('search', value))
  };


  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <div className="max-w-xl">
        <Input
          placeholder="Search ..."
          value={value}
          onValueChange={handleChange}
          startContent={<FiSearch />}
        />
      </div>
      <Button 
        size="sm"
        onPress={() => {
          const newSort = (AscOrDesc === 'asc') ? 'desc' : 'asc';
          setAscOrDesc(newSort);
          router.push(pathname + '?' + createQueryString('sort', newSort))
        }}
      >
        {(AscOrDesc === 'asc') ? <FiArrowDown /> : <FiArrowUp />}
        Date
      </Button>
    </div>
  )
}

export function Element({
  data,
  id,
  lang,
  size = "11rem", // Default size
}: {
  data: PlantData;
  lang: (typeof locales)[number];
  id: string;
  size?: string;
}) {
  const fallback = "https://nextui.org/images/hero-card-complete.jpeg";

  const imageSrc = data.image ? data.image : fallback;

  return (
    <Link href={`/article/${id}`}>
      <div className="resizeable-card" style={{ width: size }}>
        <motion.button
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-full"
        >
          <Card isFooterBlurred radius="lg" className="border-none h-full">
          <CardBody className="relative pb-[56.25%] overflow-hidden">
              <Image
                removeWrapper
                alt="Plant"
                className="absolute inset-0 w-full h-full object-cover"
                src={imageSrc}
                fallbackSrc={fallback}
              />
            </CardBody>
            <CardHeader className="absolute top-1 flex-col items-start p-4">
              <div className="flex flex-col">
                <div className="text-white/40 font-bold text-left line-clamp-1 text-xs">
                  {data.latin_name}
                </div>
                <div className="text-white/90 font-medium text-wrap text-left mt-1 line-clamp-2 text-lg">
                  {data[lang].name}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.button>
      </div>
    </Link>
  );
}



export function ArticlesViewer({ dict, lang }: { lang: (typeof locales)[number], dict: any }) {
  const [offset, setOffset] = useState(0)
  const [elements_data, set_elements_data] = useState<{ data: PlantData, id: string }[]>([])
  const ref = collection(db, "articles");
  const elementsPerPage = 24;

  useEffect(() => {
    getDocs(query(
        ref, 
        orderBy("date"), 
        limit(elementsPerPage), 
        startAfter(offset),
        where("disable_in_search", "==", false)
      )
    ).then((q) => {
      set_elements_data(q.docs.map((doc) => {
        return { data: doc.data() as PlantData, id: doc.id };
      }))
    })
  }, [])
    
  // render all elements in the collection trought the Element function
  let elements = elements_data.map(({data, id}: {data: PlantData, id: string}) => {
      return (
        <Element key={data.date} data={data} lang={lang} id={id} size={"15rem"}/>
      );
  });
  // const last_element_date = elements_data[elements_data.length - 1].data.date;

  return (
      <>
      <div className="flex flex-row justify-center items-center w-full">
          <div className="w-full h-full"></div>
          <h1>{dict.articles.title}</h1>
          <div className="w-full h-full flex flex-row justify-end items-center">
            <NewArticle />
          </div>
      </div>
          <div className="flex gap-4 flex-wrap content-start items-center justify-center">
            {elements}
          </div>
      </>
  )
}