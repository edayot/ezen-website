import { getDictionary, HomeProps } from "@/dictionaries/dictionaries";
import { ArticleEditor } from "@/components/EditArticles";

export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className=" w-5/6">
        <br />
        <ArticleEditor lang={params.lang} />
      </div>
    </div>
  );
}
