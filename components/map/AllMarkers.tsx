"use client";
import { MapViewer } from "@/components/map/Default";
import { PlantData } from "@/utils/article";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { locales } from "@/langs";
import { useState } from "react";
import { Element } from "../ArticleCard";


function ArticleMarker({element, lang}: {element: {data: PlantData, id: string}, lang: typeof locales[number]}) {
    if (!element.data.position) {
        return <></>
    }
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)

    let delay = 1000;
    if(window.matchMedia("(pointer: coarse)").matches) {
        delay = 100;
    }
    const icon = new Icon({
        iconUrl: "/images/leaf.svg",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        tooltipAnchor: [0, -30],
    });
    return (
    <Marker 
        position={[element.data.position.x, element.data.position.y]}
        eventHandlers={{
            mouseover: (e) => {
                setOpen(true);
            },
            mouseout: (e) => {
                setTimeout(() => {setOpen(false);}, delay)
            },
          }}
        ref={ref => {
            setTimeout(() => ref?.openPopup(), 500)
          }}
        icon={icon}
    >
        <Popup 
            closeButton={false}
            autoClose={false}
            closeOnClick={false}
            closeOnEscapeKey={false}
            interactive
            eventHandlers={{
                mouseover: (e) => {
                    setOpen2(true);
                },
                mouseout: (e) => {
                    setTimeout(() => {setOpen2(false);}, delay)
                },
              }}
              className="w-fit"
            
        >
            
            {(open || open2) ? 
                <div className="flex gap-4 flex-wrap content-start items-center justify-center">
                    <Element data={element.data} id={element.id} lang={lang} size="20"/>
                </div>
                : element.data[lang].name}
        </Popup>
    </Marker>)
}



export function MapWithArticles({data, lang}: {data: {data: PlantData, id: string}[], lang: (typeof locales)[number]}) {
    let elements = data.map((element) => <ArticleMarker element={element} lang={lang}/>);
    return <MapViewer>
        {elements}
      </MapViewer>
}

