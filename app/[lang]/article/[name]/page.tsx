"use server";
import { DeleteButton } from "@/components/DeleteButton";
import { ExportButton } from "@/components/ExportButton";
import { NotFound } from "@/components/NotFoundComponent";
import {
  EditButton,
  IsUserLoggedIn,
  ToMapButton,
} from "@/components/RedirectButton";
import RenderArticle from "@/components/RenderArticle";
import { HomeProps } from "@/dictionaries/dictionaries";
import { PlantData } from "@/utils/article";
import { collectionRef } from "@/utils/firebase";
import { doc, getDoc } from "@firebase/firestore";

export default async function Home({ params }: { params: HomeProps }) {
  const document = await getDoc(doc(collectionRef, params.name));
  const data: PlantData = document.data() as PlantData;

  if (!data) {
    return <NotFound />;
  }
  if (!params.bypass && (data.disable_in_search || data.disable_map_position)) {
    return <NotFound id={document.id} />;
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-row justify-end items-end w-11/12 m-2 gap-2">
          <IsUserLoggedIn>
            {data.protected ? <></> : <DeleteButton id={document.id} />}
            <ExportButton id={document.id} />
            <EditButton id={document.id} />
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
