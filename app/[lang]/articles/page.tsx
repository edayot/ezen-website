import { getDictionary, HomeProps } from "@/dictionaries/dictionaries";
import {
  getDocs,
  query,
  collection,
  orderBy,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { db } from "@/utils/firebase";
import React from "react";
import { ArticlesViewer } from "@/components/ArticleCard";
import { PlantData } from "@/utils/article";

interface searchParamsInterface {
  search: string;
  sort: "asc" | "desc";
  page: number
}


export default async function Home({ params, searchParams }: { params: HomeProps, searchParams: searchParamsInterface }) {
  const dict = await getDictionary(params.lang);
  const ref = collection(db, "articles");

  let q = await getDocs(query(ref, orderBy("date")));
  let elements_data = q.docs.map((doc) => {
    return { data: doc.data() as PlantData, id: doc.id };
  });
  elements_data = elements_data.filter(({ data }) => {
    return !data.disable_in_search
  })
  // filter the elements based on the search query
  if (searchParams.search) {
    elements_data = elements_data.filter(({ data }) => {
      const matchingNames = [
        data.latin_name,
        data.fr.name,
        data.en.name,
        data.it.name,
      ];
      let found = false;
      matchingNames.forEach((name) => {
        if (name.toLowerCase().includes(searchParams.search.toLowerCase())) {
          found = true;
        }
      });
      return found;
    });
  }
  let page = 1;
  if (searchParams.page) {page = searchParams.page}
  const elementsPerPage = 3*5;
  const numberOfPages = Math.ceil(elements_data.length/elementsPerPage);
  elements_data = elements_data.slice((page-1)*elementsPerPage, page*elementsPerPage);


  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="w-11/12">
        <div className=" flex flex-col justify-center items-center gap-2">
          <ArticlesViewer elements_data={elements_data} dict={dict} lang={params.lang} initPage={page} lenghtPage={numberOfPages}/>
        </div>
      </div>
    </div>
  );
}
