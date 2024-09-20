import { HomeProps } from "@/dictionaries/dictionaries";
import { LoginComponent } from "@/components/login/LoginComponent";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="w-5/6 max-w-xl">
          <IsUserLoggedIn fallback={<LoginComponent />}>
            <RedirectComponent href="/auth/account" />
          </IsUserLoggedIn>
        </div>
      </div>
    </>
  );
}
