"use server";
import { getDictionary, HomeProps } from "@/dictionaries/dictionaries";
import { getDoc, collection, doc } from "@firebase/firestore";
import { db } from "@/utils/firebase";
import RenderArticle from "@/components/RenderArticle";
import { PlantData } from "@/utils/article";
import { EditButton } from "@/components/RedirectButton";
import { ExportButton } from "@/components/ExportButton";
import { NotFound } from "@/components/NotFoundComponent";

export default async function Home({ params, bypass = false }: { params: HomeProps, bypass?: boolean }) {
  const dict = await getDictionary(params.lang);

  const ref = collection(db, "articles");
  const document = await getDoc(doc(ref, params.name));
  const data: PlantData = document.data() as PlantData;

  if (!data) {
    return <NotFound/>
  }
  if (!bypass && (data.disable_in_search || data.disable_map_position)) {
    return <NotFound id={document.id}/>
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-row justify-end items-end w-11/12">
          <ExportButton id={document.id}/>
          <EditButton id={document.id} />
        </div>
      </div>
      <RenderArticle data={data} lang={params.lang} />
    </>
  );
}
