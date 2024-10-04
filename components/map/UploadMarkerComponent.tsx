"use client";

import { useTranslation } from "@/dictionaries/client";
import { PlantData } from "@/utils/article";
import { storage } from "@/utils/firebase";
import { ref } from "firebase/storage";
import { useState } from "react";
import { UploadToCloud } from "@/components/FormEditor";

export function UploadMarker({
  all,
  setAll,
}: {
  all: PlantData;
  setAll: (value: any) => void;
}) {
  const [error, setError] = useState("");

  const handleUploadComplete = (url: string) => {
    setAll({
      ...all,
      map_marker: url,
    });
    setError("");
  };

  const transformImage = async (file: File): Promise<File> => {
    const img = new Image();
    const imagePromise = new Promise<HTMLImageElement>((resolve) => {
      img.onload = () => resolve(img);
    });

    img.src = URL.createObjectURL(file);
    await imagePromise;

    // Create a canvas with a square background to center the image
    const maxSide = Math.max(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = maxSide;
    canvas.height = maxSide;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, (maxSide - img.width) / 2, (maxSide - img.height) / 2);

    // Convert the centered image into a PNG Blob
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );

    // Return a new File object
    return new File([blob], `${file.name.split(".")[0]}.png`, {
      type: "image/png",
    });
  };

  const getStorageRef = (filename: string) => ref(storage, `markers/${filename}`);

  const t = useTranslation();

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <UploadToCloud
        onUploadComplete={handleUploadComplete}
        transformImage={transformImage}
        getStorageRef={getStorageRef}
      />
    </div>
  );
}
