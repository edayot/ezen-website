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
import { useState } from "react";
import { useCallback } from "react";
import { FiSearch, FiArrowDown, FiArrowUp} from "react-icons/fi";
import { NewArticle } from "./RedirectButton";


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
}: {
  data: PlantData;
  lang: (typeof locales)[number];
  id: string;
}) {
  const local_data = data[lang];
  const router = useRouter();

  const redirectToArticle = (event: any) => {
    console.log(`Redirecting to article ${id}`);
    router.push(`/article/${id}`);
  };
  let imageSrc = data.image
    ? data.image
    : "https://nextui.org/images/hero-card-complete.jpeg";

  let imageComponent = (
    <Image
      removeWrapper
      alt="Woman listing to music"
      className="z-0 w-72 object-cover h-44"
      src={imageSrc}
      fallbackSrc="https://nextui.org/images/hero-card-complete.jpeg"
    />
  );

  return (
    <div key={data.date} className="">
      <motion.button
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.95 }}
        onClick={redirectToArticle}
      >
        <Card isFooterBlurred radius="lg" className="border-none">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/40 font-bold">
              {data.latin_name}
            </p>
            <h4 className="text-white/90 font-medium text-2xl text-wrap text-left">
              {data[lang].name}
            </h4>
          </CardHeader>
          {imageComponent}
        </Card>
      </motion.button>
    </div>
  );
}



export function ArticlesViewer({elements_data, dict, lang, initPage = 1, lenghtPage = 1}: {elements_data : any, lang: (typeof locales)[number], dict: any, initPage?: number, lenghtPage?: number}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pageNumber, setPageNumber] = useState(initPage);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      return appplySearchParam(searchParams, name, value)
    },
    [searchParams]
  )
  const handleChange = (value: number) => {
    setPageNumber(value);
    router.push(pathname + '?' + createQueryString('page', value.toString()))
  };

  let search = searchParams.get('search') || "";
  let sortOrder = searchParams.get('sort');
  if (!sortOrder) {sortOrder = "asc";}
    
  // render all elements in the collection trought the Element function
  let elements = elements_data.map(({data, id}: {data: PlantData, id: string}) => {
      return (
      <Element key={data.date} data={data} lang={lang} id={id} />
      );
  });
  // reverse the list if the sort is desc
  if (sortOrder == "desc") {elements.reverse();}

  return (
      <>
      <div className="flex flex-row justify-center items-center w-full">
          <div className="w-full h-full"></div>
          <h1>{dict.articles.title}</h1>
          <div className="w-full h-full flex flex-row justify-end items-center">
            <NewArticle />
          </div>
      </div>
          <SearchBar initSortDirection={sortOrder} initValue={search}/>
          <div className="flex gap-4 flex-wrap content-start">{elements}</div>
          <Pagination 
            isCompact 
            showControls 
            total={lenghtPage} 
            page={pageNumber}
            onChange={handleChange}
          />
      </>
  )
}