import { HomeProps } from "@/dictionaries/dictionaries";
import { ArticleEditor } from "@/components/EditArticles";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <div className="flex flex-row justify-center">
      <div className=" w-11/12">
        <br />
        <ArticleEditor lang={params.lang} />
      </div>
    </div>
  );
}
