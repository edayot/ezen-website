"use client";
import { MapViewer } from "@/components/map/Default";
import { PlantData } from "@/utils/article";
import { Marker } from "react-leaflet";



export function MapWithArticles({data}: {data: {data: PlantData, id: string}[]}) {
    let elements = data.map((element) => {
        if (!element.data.position) {
            return <></>
        }
        return <Marker position={[element.data.position.x, element.data.position.y]}></Marker>
    });
    return <MapViewer>
        {elements}
      </MapViewer>
}

