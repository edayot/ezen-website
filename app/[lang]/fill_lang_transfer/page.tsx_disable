"use client";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, doc, setDoc } from "@firebase/firestore";
import { Button } from "@nextui-org/react";
import { collectionRef } from "@/utils/firebase";




function Transfer() {
  const ref = collection(db, "articles_revamp");

  getDocs(query(ref)).then((q) => {
    q.docs.forEach((document) => {
      const data = document.data();
      data.es = {
        name: "",
        place: "",
        desc: "",
      }
      data.de = {
        name: "",
        place: "",
        desc: "",
      }
      setDoc(doc(collectionRef, document.id), data).then(() => {
        console.log("Document successfully written!");
      });
    });
});
}


export default function Home() {
  return <Button onClick={Transfer}>Transfer database</Button>;
}
