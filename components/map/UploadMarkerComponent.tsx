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
    const timestamp = new Date().getTime();
    const file = acceptedFiles[0];

    // Create an image object to get the dimensions
    const img = new Image();
    img.onload = () => {
      // Upload image to Firebase storage
      const storageRef = ref(storage, `markers/${file.name}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!", snapshot);
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
    };

    // Read the file as a data URL to trigger the image load
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
