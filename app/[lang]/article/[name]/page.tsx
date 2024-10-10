"use client";
import { DeleteButton } from "@/components/DeleteButton";
import { ExportButton } from "@/components/ExportButton";
import { NotFound } from "@/components/NotFoundComponent";
import { EditButton, IsUserLoggedIn } from "@/components/RedirectButton";
import RenderArticle from "@/components/RenderArticle";
import { HomeProps } from "@/dictionaries/dictionaries";
import { PlantData } from "@/utils/article";
import { articlesRef } from "@/utils/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { lazy, useEffect, useState } from "react";
const ToMapButton = lazy(() =>
  import("@/components/map/ToMapButton").then((mod) => ({
    default: mod.ToMapButton,
  })),
);

export default function Home({ params }: { params: HomeProps }) {
  const [data, setData] = useState<PlantData | null>(null);

  useEffect(() => {
    getDoc(doc(articlesRef, params.name)).then((document) => {
      setData(document.data() as PlantData);
    });
  }, [params.name]);

  if (data === null) {
    return <></>;
  }
  if (data === undefined) {
    return <NotFound id={params.name} />;
  }
  if (!params.bypass && data.disable_in_search) {
    return <NotFound id={params.name} />;
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-row justify-end items-end w-11/12 m-2 gap-2">
          <IsUserLoggedIn>
            {data.protected ? <></> : <DeleteButton id={params.name} />}
            <ExportButton id={params.name} data={data} />
            <EditButton id={params.name} />
          </IsUserLoggedIn>
          {data.position && !data.disable_map_position ? (
            <ToMapButton pos={data.position} lang={params.lang} />
          ) : (
            <></>
          )}
        </div>
      </div>
      <RenderArticle data={data} lang={params.lang} />
    </>
  );
}
