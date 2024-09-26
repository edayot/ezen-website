import { useTranslation } from "@/dictionaries/client";
import { PlantData } from "@/utils/article";
import { storage } from "@/utils/firebase";
import { Image, Select, SelectItem } from "@nextui-org/react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";

export function SelectMarker({
  all,
  setAll,
}: {
  all: PlantData;
  setAll: (value: PlantData) => void;
}) {
  const t = useTranslation();
  const [markers, setMarkers] = useState<{ [filename: string]: string }>({});
  useEffect(() => {
    const storageRef = ref(storage, "markers/");
    listAll(storageRef).then((value) => {
      Promise.all(
        value.items.map((v) =>
          getDownloadURL(v).then((url) => ({ [v.name]: url })),
        ),
      ).then((urls) => {
        const markersMap = Object.assign({}, ...urls);
        setMarkers(markersMap);
      });
    });
  }, [all.map_marker]);
  useEffect(() => {
    if (!all.map_marker) {
      setAll({ ...all, map_marker: Object.values(markers)[0] });
    }
  }, [markers]);

  if (Object.keys(markers).length === 0) {
    return;
  }
  let defaultMarker = all.map_marker
    ? all.map_marker
    : Object.values(markers)[0];

  const MarkerImage = ({ marker, url }: { marker: string; url: string }) => {
    return (
      <div
        className="flex flex-row gap-4 items-center justify-center h-10 w-full"
        key={marker}
      >
        <Image src={url} alt={marker} style={{ objectFit: "contain" }} />
        {marker}
      </div>
    );
  };

  const selectedKeys = new Set(defaultMarker ? [defaultMarker] : []);

  return (
    <Select
      label={t["articles.new.map.label.marker"]}
      variant="bordered"
      selectedKeys={selectedKeys}
      className="max-w-xs"
      onSelectionChange={(keys) => {
        const keysArray = Array.from(keys);
        if (keysArray.length === 0) {
          return;
        }
        const newAll = { ...all };
        newAll.map_marker = keysArray[0].toString();
        setAll(newAll);
      }}
      renderValue={(items) => {
        return (
          <>
            {items.map((item) => {
              const marker = item.textValue; // Extract the text value from the item object
              const url = item.key?.toString();
              if (!url) return null;
              if (!marker) return null;
              return <MarkerImage key={marker} marker={marker} url={url} />;
            })}
          </>
        );
      }}
    >
      {Object.entries(markers).map(([filename, url]) => (
        <SelectItem key={url} textValue={filename}>
          <MarkerImage marker={filename} url={url} />
        </SelectItem>
      ))}
    </Select>
  );
}
