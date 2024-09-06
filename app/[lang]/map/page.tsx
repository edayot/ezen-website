import { MapViewer } from "@/components/map/Default";
import {
  getDocs,
  query,
  collection,
  orderBy,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { db } from "@/utils/firebase";
import { PlantData } from "@/utils/article";

export default async function Home() {
  const ref = collection(db, "articles");

  let q = await getDocs(query(ref, orderBy("date")));
  let elements_data = q.docs.map((doc) => {
    return { data: doc.data(), id: doc.id } as {data: PlantData, id: string};
  });
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapViewer>
      </MapViewer>
    </div>
  );
}
