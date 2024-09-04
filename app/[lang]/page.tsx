import { getDictionary, HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {
  const dict = await getDictionary(params.lang);
  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className="w-5/6 max-w-xl">Home Page</div>
    </div>
  );
}
