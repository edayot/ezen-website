"use client";

import { MapViewer } from "./Default";
import { PlantData } from "@/utils/article";
import { useState, useMemo, useRef } from "react";
import { Marker } from "react-leaflet";



function DrageableMarker({
    all,
    setAll,
  }: {
    all: PlantData;
    setAll: (value: PlantData) => void;}
) {
    let initPos = {
        lat: 50,
        lng: 50,
    }
    if (all.position) {
        initPos.lat = all.position.x;
        initPos.lng = all.position.y;
    }
    console.log(initPos.lat, initPos.lng);
    const [pos, setPos] = useState(initPos);
    const markerRef = useRef(null)

    const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker : any = markerRef.current
            if (marker != null) {
                let newPos = marker.getLatLng()
                setPos(newPos)
                let newAll = { ...all };
                newAll.position = {
                    x:newPos.lat,
                    y:newPos.lng,
                }
                setAll(newAll);
            }
          },
        }),
        [],
      )
    return <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={pos}
        ref={markerRef}
    >
    </Marker>
}


export function EditMap({
    all,
    setAll,
  }: {
    all: PlantData;
    setAll: (value: PlantData) => void;}
) {
    return <MapViewer>
        <DrageableMarker all={all} setAll={setAll}/>
    </MapViewer>
}


