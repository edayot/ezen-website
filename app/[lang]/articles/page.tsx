import { HomeProps } from "@/dictionaries/dictionaries";
import React from "react";
import { ArticlesViewer } from "@/components/ArticleCard";
import { PlantData } from "@/utils/article";



export default async function Home({ params }: { params: HomeProps }) {
  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="w-11/12 max-w-6xl">
        <div className=" flex flex-col justify-center items-center gap-2">
          <ArticlesViewer lang={params.lang}/>
        </div>
      </div>
    </div>
  );
}
