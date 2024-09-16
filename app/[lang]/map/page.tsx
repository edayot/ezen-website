import {
  getDocs,
  query,
  collection,
  orderBy,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { db } from "@/utils/firebase";
import { PlantData } from "@/utils/article";
import { MapWithArticles } from "@/components/map/AllMarkers";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {

  let q = await getDocs(query(collectionRef, orderBy("date")));
  let elements_data = q.docs.map((doc) => {
    return { data: doc.data(), id: doc.id } as {data: PlantData, id: string};
  });
  elements_data = elements_data.filter(({ data }) => {
    return !data.disable_map_position
  })
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapWithArticles data={elements_data} lang={params.lang}/>
    </div>
  );
}
