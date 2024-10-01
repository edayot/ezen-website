"use client";

import { useTranslation } from "@/dictionaries/client";
import { PlantData } from "@/utils/article";
import { storage } from "@/utils/firebase";
import {
  Card,
  CardBody,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

export function UploadMarker({
  all,
  setAll,
}: {
  all: PlantData;
  setAll: (value: any) => void;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles: any) => {
    onOpen();
    const file = acceptedFiles[0];
    const img = new Image();

    img.onload = () => {
      // Créer un canvas carré avec des bords transparents
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Définir la taille du carré selon la dimension maximale de l'image
      const maxSide = Math.max(img.width, img.height);
      canvas.width = maxSide;
      canvas.height = maxSide;

      // Définir le fond transparent pour le canvas
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      // Calculer les décalages pour centrer l'image dans le carré
      const xOffset = (canvas.width - img.width) / 2;
      const yOffset = (canvas.height - img.height) / 2;

      // Dessiner l'image centrée dans le canvas
      ctx!.drawImage(img, xOffset, yOffset);

      // Convertir le canvas en Blob (format PNG pour forcer la transparence)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Créer un nouveau nom de fichier pour garantir l'extension PNG
            const newFile = new File([blob], `${file.name.split('.')[0]}.png`, {
              type: "image/png",
            });

            // Créer une référence dans Firebase storage
            const storageRef = ref(storage, `markers/${newFile.name}`);

            // Uploader l'image convertie en PNG
            uploadBytes(storageRef, newFile)
              .then((snapshot) => {
                console.log("Uploaded a PNG file!", snapshot);
                getDownloadURL(snapshot.ref).then((url) => {
                  setAll({
                    ...all,
                    map_marker: url,
                  });
                });
                setError("");
                onClose();
              })
              .catch((error) => {
                console.error("Error uploading file", error);
                setError(`Error uploading file: ${error}`);
                setTimeout(() => {
                  setError("");
                  onClose();
                }, 1000);
              });
          }
        },
        "image/png" // Forcer le format PNG pour préserver la transparence
      );
    };

    // Lire le fichier pour déclencher le chargement de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const t = useTranslation();
  let upload_text = t["articles.new.global.drop_image"];
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent>
          <ModalBody>
            <div className=" flex justify-center items-center">
              {error ? <div>{error}</div> : <CircularProgress size="lg" />}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        <div className="dropzone">
          <Card className="w-64 h-30">
            <CardBody>
              <div className="flex flex-col justify-center items-center gap-6 text-center">
                <FiUpload size={50} />
                <p>{upload_text}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
