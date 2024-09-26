import { ArticlesViewer } from "@/components/ArticleCard";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="w-11/12 max-w-6xl">
        <div className=" flex flex-col justify-center items-center gap-4">
          <ArticlesViewer lang={params.lang} />
        </div>
      </div>
    </div>
  );
}
