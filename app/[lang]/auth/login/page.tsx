import { HomeProps } from "@/dictionaries/dictionaries";
import { LoginComponent } from "@/components/login/LoginComponent";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="w-5/6 max-w-xl">
          <LoginComponent />
        </div>
      </div>
    </>
  );
}
