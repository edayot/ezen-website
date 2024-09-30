import { ArticleEditor } from "@/components/EditArticles";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <div className="flex flex-row justify-center">
      <div className=" w-[97.5%]">
        <br />
        <IsUserLoggedIn fallback={<RedirectComponent message="You need to be logged in to use the article editor" href="/"/>}>
          <ArticleEditor lang={params.lang} />
        </IsUserLoggedIn>
      </div>
    </div>
  );
}
