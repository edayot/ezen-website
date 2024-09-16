
import { PlantData } from "@/utils/article";
import { MapWithArticles } from "@/components/map/AllMarkers";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapWithArticles lang={params.lang}/>
    </div>
  );
}
