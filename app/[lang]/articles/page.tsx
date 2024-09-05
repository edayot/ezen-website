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
}


export default async function Home({ params, searchParams }: { params: HomeProps, searchParams: searchParamsInterface }) {
  const dict = await getDictionary(params.lang);
  const ref = collection(db, "articles");

  let q = await getDocs(query(ref, orderBy("date")));
  let elements_data = q.docs.map((doc) => {
    return { data: doc.data(), id: doc.id };
  });
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

  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className="w-11/12 max-w-9xl">
        <div className=" flex flex-col justify-center items-center gap-2">
          <ArticlesViewer elements_data={elements_data} dict={dict} lang={params.lang}/>
        </div>
      </div>
    </div>
  );
}
