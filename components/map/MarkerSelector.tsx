

import { PlantData, markers } from "@/utils/article";
import { Select, SelectItem } from "@nextui-org/react";
import { Image } from "@nextui-org/react";



export function SelectMarker({
    all,
    setAll,
  }: {
    all: PlantData;
    setAll: (value: PlantData) => void;
  }) {
    let defaultMarker = all.map_marker ? all.map_marker : markers[0];
    console.log(all.map_marker, defaultMarker);
  
    const MarkerImage = ({marker}: {marker: string}) => {
      return (
        <div className="flex flex-row gap-4 items-center justify-center h-10" key={marker}>
          <Image
            src={`/images/markers/${marker}.png`}
            alt={marker}
            style={{ objectFit: "contain" }}
          />
          {marker}
        </div>
      );
    };
  
    const selectedKeys =new Set([defaultMarker]);
  
    return (
      <Select
        label="Select a marker"
        variant="bordered"
        selectedKeys={selectedKeys}
        className="max-w-xs"
        onSelectionChange={(keys) => {
          
          const keysArray = Array.from(keys);
          if (keysArray.length === 0) { return; }
          const newAll = { ...all };
          newAll.map_marker = keysArray[0].toString();
          setAll(newAll);
        }}
        renderValue={(items) => {
          return items.map((item) => {
            const marker = item.textValue; // Extract the text value from the item object
            return <MarkerImage key={marker} marker={marker || defaultMarker} />;
          });
        }}
          >
        {markers.map((marker) => (
          <SelectItem key={marker} textValue={marker}>
            <MarkerImage marker={marker} />
          </SelectItem>
        ))}
      </Select>
    );
  }
  