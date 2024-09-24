import { PlantData } from "@/utils/article";
import { MapWithArticles } from "@/components/map/AllMarkers";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params, searchParams }: { params: HomeProps, searchParams: { pos_x?: string, pos_y?: string } }) {
  if (searchParams.pos_x && searchParams.pos_y) {
    return (
      <div className="w-screen fixed top-16 bottom-0">
        <MapWithArticles lang={params.lang} initPosition={{ x: Number(searchParams.pos_x), y: Number(searchParams.pos_y) }} />
      </div>
    );
  }
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapWithArticles lang={params.lang} />
    </div>
  );
}
