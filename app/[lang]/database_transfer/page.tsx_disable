"use client";
import { Button } from "@nextui-org/react";
import { db, storage } from "@/utils/firebase";
import { collection, getDocs, query, addDoc } from "@firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

function base64ToBlob(base64: string, mime: any) {
  const byteString = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mime });
}

function Transfer() {
  const oldRef = collection(db, "articles");
  const newRef = collection(db, "articles_revamp");

  getDocs(query(oldRef)).then((q) => {
    q.docs.forEach((doc) => {
      const timestamp = new Date().getTime();
      const data = doc.data();

      if (!data.image) {
        addDoc(newRef, data).then((newDocRef) => {
          console.log(
            `Article without image added, oldRef : ${doc.id}, newRef : ${newDocRef.id}`,
          );
        });
        return;
      }

      // transform doc.image (data base64 url), doc.image_filename (string) into a image object
      const img = new Image();
      img.src = data.image;
      // Convert base64 to Blob
      const mime = data.image.split(";")[0].split(":")[1]; // Extract MIME type from the base64 string
      const blob = base64ToBlob(data.image, mime);

      img.onload = () => {
        const { width, height } = img;
        // create a filename for the image with the timestamp before the .png
        const new_filename =
          data.image_filename.split(".")[0] + "_" + timestamp + ".png";
        const storageRef = ref(storage, `images/${new_filename}`);
        uploadBytes(storageRef, blob)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              addDoc(newRef, {
                ...data,
                image: url,
                image_filename: data.image_filename,
                image_height: height,
                image_width: width,
              }).then((newDocRef) => {
                console.log(
                  `Article added, oldRef : ${doc.id}, newRef : ${newDocRef.id}`,
                );
              });
            });
          })
          .catch((error) => {
            console.error("Error uploading file", error);
          });
      };
    });
  });
}

export default function Home() {
  return <Button onClick={Transfer}>Transfer database</Button>;
}
