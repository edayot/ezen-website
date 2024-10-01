import { MapWithArticles } from "@/components/map/AllMarkers";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({
  params,
  searchParams,
}: {
  params: HomeProps;
  searchParams: {
    bound00?: string;
    bound01?: string;
    bound10?: string;
    bound11?: string;
  };
}) {
  if (
    searchParams.bound00 &&
    searchParams.bound01 &&
    searchParams.bound10 &&
    searchParams.bound11
  ) {
    return (
      <div className="w-screen fixed top-16 bottom-0">
        <MapWithArticles
          lang={params.lang}
          initBounds={[
            {
              x: parseFloat(searchParams.bound00),
              y: parseFloat(searchParams.bound01),
            },
            {
              x: parseFloat(searchParams.bound10),
              y: parseFloat(searchParams.bound11),
            },
          ]}
        />
      </div>
    );
  }
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapWithArticles lang={params.lang} />
    </div>
  );
}
