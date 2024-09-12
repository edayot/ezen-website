"use server";
import { getDictionary, HomeProps } from "@/dictionaries/dictionaries";
import { getDoc, collection, doc } from "@firebase/firestore";
import { db } from "@/utils/firebase";
import RenderArticle from "@/components/RenderArticle";
import { PlantData } from "@/utils/article";
import { notFound } from "next/navigation";
import { EditButton } from "@/components/RedirectButton";
import { ExportButton } from "@/components/ExportButton";

export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);

  const ref = collection(db, "articles");
  const document = await getDoc(doc(ref, params.name));
  const data: PlantData = document.data() as PlantData;
  if (!data) {
    return notFound();
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-end items-end w-11/12">
          <ExportButton id={document.id}/>
          <EditButton id={document.id} />
        </div>
      </div>
      <RenderArticle data={data} lang={params.lang} />
    </>
  );
}
