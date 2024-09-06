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

export default async function Home() {
  const ref = collection(db, "articles");

  let q = await getDocs(query(ref, orderBy("date")));
  let elements_data = q.docs.map((doc) => {
    return { data: doc.data(), id: doc.id } as {data: PlantData, id: string};
  });
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapWithArticles data={elements_data}/>
    </div>
  );
}
