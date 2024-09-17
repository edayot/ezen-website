"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Pagination,
  PaginationItemRenderProps,
  PaginationItem,
  PaginationItemType,
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
  orderBy,
  limit,
  startAfter,
  where,
  getCountFromServer,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { collectionRef } from "@/utils/firebase";


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
  className,
}: {
  data: PlantData;
  lang: (typeof locales)[number];
  id: string;
  className?: string;
}) {
  const fallback = "https://nextui.org/images/hero-card-complete.jpeg";

  const imageSrc = data.image ? data.image : fallback;

  return (
    <Link href={`/article/${id}`}>
      <div className={"resizeable-card" + " " + className}>
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
                <div className="text-white/40 font-bold text-left line-clamp-1" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                  {data.latin_name}
                </div>
                <div className="text-white/90 font-medium text-wrap text-left mt-1 line-clamp-2" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)' }}>
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
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [startValue, setStartValue] = useState<number | undefined>(0)
  const [endValue, setEndValue] = useState<number | undefined>(undefined)
  const [elements_data, set_elements_data] = useState<{ data: PlantData, id: string }[]>([])
  const elementsPerPage = 12;

  useEffect(() => {
    let q = undefined;
    let reverse = false;
    if (startValue !== undefined) {
      q = query(
        collectionRef, 
        orderBy("date"), 
        limit(elementsPerPage), 
        startAfter(startValue),
        where("disable_in_search", "==", false)
      )
    } else if (endValue !== undefined) {
      q = query(
        collectionRef, 
        orderBy("date", "desc"), 
        limit(elementsPerPage), 
        startAfter(endValue),
        where("disable_in_search", "==", false)
      )
      reverse = true;
    }
    if (q === undefined) { return}
    getDocs(q).then((q) => {
      let ele = q.docs.map((doc) => {
        return { data: doc.data() as PlantData, id: doc.id };
      })
      if (reverse) { ele = ele.reverse() }
      set_elements_data(ele)
    })
  }, [page])

  useEffect(() => {
    getCountFromServer(query(collectionRef, where("disable_in_search", "==", false))).then((count) => {
      setMaxPage(Math.ceil(count.data().count / elementsPerPage))
    })
  }, [])
    
  // render all elements in the collection trought the Element function
  let elements = elements_data.map(({data, id}: {data: PlantData, id: string}) => {
      return (
        <Element key={data.date} data={data} lang={lang} id={id} className="w-[8rem] md:w-[11rem] lg:w-[15rem] transition-all duration-500 ease-in-out"/>
      );
  });
  let last_element_date = 0;
  if (elements_data.length > 0) {
    last_element_date = elements_data[elements_data.length - 1].data.date;
  }
  let first_element_date = 0;
  if (elements_data.length > 0) {
    first_element_date = elements_data[0].data.date;
  }

  const handlePagination = (newPage : number) => {
    if (newPage > page) {
      setStartValue(last_element_date);
      setEndValue(undefined);
      setPage(newPage);
      console.log({
        start: last_element_date,
        end: undefined,
        newPage: newPage
      })
    } else if (newPage < page) {
      setStartValue(undefined);
      setEndValue(first_element_date);
      setPage(newPage);
      console.log({
        start: undefined,
        end: first_element_date,
        newPage: newPage
      })
    }
  }
  
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
      <Pagination
        total={maxPage}
        page={page}
        onChange={handlePagination}
        showControls={true}
        isDisabled={false}
        renderItem={({ ...props }: PaginationItemRenderProps) => {
          const isDisabled = (
            (props.value == PaginationItemType.DOTS) ||
            (typeof props.value === 'number')
          )
          return (<>
            <PaginationItem {...props} isDisabled={isDisabled}/>
          </>)
        }}
      />
      </>
  )
}