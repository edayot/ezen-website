import { ArticleEditor } from "@/components/EditArticles";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <div className="flex flex-row justify-center">
      <div className=" w-[97.5%]">
        <br />
        <ArticleEditor lang={params.lang} />
      </div>
    </div>
  );
}
