import { ArticleEditor } from "@/components/EditArticles";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { HomeProps } from "@/dictionaries/dictionaries";
import { PlantData } from "@/utils/article";
import { collectionRef } from "@/utils/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: HomeProps }) {
  const document = await getDoc(doc(collectionRef, params.name));
  const data: PlantData = document.data() as PlantData;
  if (!data) {
    return notFound();
  }
  return (
    <div className="flex flex-row justify-center">
      <div className=" w-[97.5%]">
        <br />
        <IsUserLoggedIn
          fallback={
            <RedirectComponent
              message="You need to be logged in to use the article editor"
              href="/"
            />
          }
        >
          <ArticleEditor lang={params.lang} initData={data} id={document.id} />
        </IsUserLoggedIn>
      </div>
    </div>
  );
}
