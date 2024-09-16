"use client";
import { MapViewer } from "@/components/map/Default";
import { PlantData, markers } from "@/utils/article";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { locales } from "@/langs";
import { useState, useEffect } from "react";
import { Element } from "../ArticleCard";
import {
    getDocs,
    query,
    where,
  } from "@firebase/firestore";
import { collectionRef } from "@/utils/firebase";


function ArticleMarker({element, lang}: {element: {data: PlantData, id: string}, lang: typeof locales[number]}) {
    const [mouseOnMarker, setMouseOnMarker] = useState(false)
    const [mouseOnPopup, setMouseOnPopup] = useState(false)

    const [open, setOpen] = useState(false)

    let delay = 1000;
    if(window.matchMedia("(pointer: coarse)").matches) {
        delay = 100;
    }

    useEffect(() => {
        if (mouseOnMarker) {
            setOpen(true);
        }
        else {
            setTimeout(() => {
                if (!mouseOnPopup) {
                    setOpen(false)
                }
            }, delay)
        }
    }, [mouseOnMarker])

    useEffect(() => {
        if (mouseOnPopup) {
            setOpen(true);
        }
        else {
            setTimeout(() => {
                if (!mouseOnMarker) {
                    setOpen(false)
                }
            }, delay)
        }
    }, [mouseOnPopup])

    if (!element.data.position) {
        return <></>
    }

    let marker = element.data.map_marker ? element.data.map_marker : markers[0];
    if (!markers.includes(marker)) {
        marker = markers[0];
    }
    const icon = new Icon({
        iconUrl: `/images/markers/${marker}.png`,
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
                setMouseOnMarker(true);
            },
            mouseout: (e) => {
                setMouseOnMarker(false);
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
                    setMouseOnPopup(true);
                },
                mouseout: (e) => {
                    setMouseOnPopup(false);
                },
              }}
              className="none"
            
        >
            
            {(open) ? 
                <>
                    <Element data={element.data} id={element.id} lang={lang} size={"10rem"}/>
                </>
                : element.data[lang].name}
            
        </Popup>
    </Marker>)
}



export function MapWithArticles({lang}: {lang: (typeof locales)[number]}) {
    const [elements_data, set_elements_data] = useState<{ data: PlantData, id: string }[]>([])
    useEffect(() => {
        getDocs(query(
            collectionRef, 
            where("disable_map_position", "==", false)
        )).then((q) => {
            set_elements_data(q.docs.map((doc) => {
                return { data: doc.data() as PlantData, id: doc.id };
            }))
        }
        )
    }, [])
    let elements = elements_data.map((element) => <ArticleMarker element={element} lang={lang} key={element.id}/>);
    return <MapViewer>
        {elements}
      </MapViewer>
}

