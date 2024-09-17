"use server";
import { HomeProps } from "@/dictionaries/dictionaries";
import { getDoc, doc } from "@firebase/firestore";
import { collectionRef } from "@/utils/firebase";
import RenderArticle from "@/components/RenderArticle";
import { PlantData } from "@/utils/article";
import { EditButton } from "@/components/RedirectButton";
import { ExportButton } from "@/components/ExportButton";
import { NotFound } from "@/components/NotFoundComponent";
import { DeleteButton } from "@/components/DeleteButton";

export default async function Home({ params }: { params: HomeProps }) {
  const document = await getDoc(doc(collectionRef, params.name));
  const data: PlantData = document.data() as PlantData;

  if (!data) {
    return <NotFound/>
  }
  if (!params.bypass && (data.disable_in_search || data.disable_map_position)) {
    return <NotFound id={document.id}/>
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-row justify-end items-end w-11/12">
          {data.protected ? <></> : <DeleteButton id={document.id} />}
          <ExportButton id={document.id}/>
          <EditButton id={document.id} />
        </div>
      </div>
      <RenderArticle data={data} lang={params.lang} />
    </>
  );
}
