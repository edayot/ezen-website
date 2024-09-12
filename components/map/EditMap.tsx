"use client";

import { MapViewer } from "./Default";
import { PlantData } from "@/utils/article";
import { useState, useMemo, useRef } from "react";
import { Marker } from "react-leaflet";
import { Icon } from "leaflet";



function DrageableMarker({
    all,
    setAll,
  }: {
    all: PlantData;
    setAll: (value: PlantData) => void;}
) {

    const icon = new Icon({
        iconUrl: "/images/leaf.svg",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        tooltipAnchor: [0, -30],
    });

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
        icon={icon}
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


