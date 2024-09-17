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
import { useEffect, useState, useRef } from "react";
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



function throttle(mainFunction: (...args: any[]) => void, delay: number) {
  let timerFlag: NodeJS.Timeout | null = null; // Timer flag to check if there is a timer running

  // Returning a throttled version 
  return (...args: any[]) => {
    if (timerFlag === null) { // If there is no timer currently running
      mainFunction(...args); // Execute the main function 
      timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}


// Implement Infinite scroll
export function ArticlesViewer({ dict, lang }: { lang: (typeof locales)[number], dict: any }) {
  const [search, setSearch] = useState('');
  const [elements_data, set_elements_data] = useState<{ data: PlantData, id: string }[]>([]);
  const [date, setDate] = useState(0);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(true);
  const elementsPerPage = 12;

  const loadMoreRef = useRef<HTMLButtonElement | null>(null);

  const infiniteScroll = useCallback(throttle(() => {
    if (!infiniteScrollEnabled) return;

    getDocs(
      query(
        collectionRef, 
        orderBy("date"),
        startAfter(date),
        limit(elementsPerPage),
        where("disable_in_search", "==", false)
      )
    ).then((q) => {
      let ele = q.docs.map((doc) => ({
        data: doc.data() as PlantData,
        id: doc.id
      }));
      if (ele.length === 0) {
        setInfiniteScrollEnabled(false);
        return;
      }
      set_elements_data((prevElements) => {
        const newElements = [...prevElements];
        ele.forEach((e) => {
          if (!newElements.map((ele) => ele.data.date).includes(e.data.date)) {
            newElements.push(e);
          }
        });
        return newElements;
      });
      setDate(ele[ele.length - 1].data.date);
    });
  }, 2000), [date, infiniteScrollEnabled]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          infiniteScroll();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [infiniteScroll]);

  const elements = elements_data.filter((ele) => {
      if (search === '') return true;
      return (
        ele.data[lang].name.toLowerCase().includes(search.toLowerCase()) || 
        ele.data.latin_name.toLowerCase().includes(search.toLowerCase())
      );
    }).map(({ data, id }: { data: PlantData, id: string }) => (
    <Element
      key={data.date}
      data={data}
      lang={lang}
      id={id}
      className="w-[8rem] md:w-[11rem] lg:w-[15rem] transition-all duration-500 ease-in-out"
    />
  ));

  return (
    <>
      <div className="flex flex-row justify-center items-center w-full">
        <div className="w-full h-full"></div>
        <h1>{dict.articles.title}</h1>
        <div className="w-full h-full flex flex-row justify-end items-center">
          <NewArticle />
        </div>
      </div>
      <div className="w-1/4">
        <Input
          value={search}
          onValueChange={setSearch}
          label="Search"
          isClearable
          radius="lg"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type to search..."
          startContent={
            <FiSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
      <div className="flex gap-4 flex-wrap content-start items-center justify-center">
        {elements}
      </div>
      <Button
        ref={loadMoreRef}
        onPress={infiniteScroll}
        disabled={!infiniteScrollEnabled}
      >
        Load More
      </Button>
    </>
  );
}