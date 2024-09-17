import { HomeProps } from "@/dictionaries/dictionaries";
import { getDoc, collection, doc } from "@firebase/firestore";
import { collectionRef } from "@/utils/firebase";
import { ArticleEditor } from "@/components/EditArticles";
import { PlantData } from "@/utils/article";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: HomeProps }) {
  const document = await getDoc(doc(collectionRef, params.name));
  const data: PlantData = document.data() as PlantData;
  if (!data) {
    return notFound();
  }
  return (
    <div className="flex flex-row justify-center">
      <div className=" w-5/6">
        <br />
        <ArticleEditor lang={params.lang} initData={data} id={document.id} />
      </div>
    </div>
  );
}
