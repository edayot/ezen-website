"use client";
import { MapViewer } from "@/components/map/Default";
import { PlantData } from "@/utils/article";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { locales } from "@/langs";
import { useState, useEffect } from "react";
import { Element } from "../ArticleCard";
import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "@firebase/firestore";
import { collectionRef } from "@/utils/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase";
import { Position } from "@/utils/article";

function ArticleMarker({
  element,
  lang,
  markers,
}: {
  element: { data: PlantData; id: string };
  lang: (typeof locales)[number];
  markers: { [filename: string]: string };
}) {
  const [mouseOnMarker, setMouseOnMarker] = useState(false);
  const [mouseOnPopup, setMouseOnPopup] = useState(false);

  const [open, setOpen] = useState(false);

  let delay = 1000;
  if (window.matchMedia("(pointer: coarse)").matches) {
    delay = 100;
  }

  useEffect(() => {
    if (mouseOnMarker) {
      setOpen(true);
    } else {
      setTimeout(() => {
        if (!mouseOnPopup) {
          setOpen(false);
        }
      }, delay);
    }
  }, [mouseOnMarker]);

  useEffect(() => {
    if (mouseOnPopup) {
      setOpen(true);
    } else {
      setTimeout(() => {
        if (!mouseOnMarker) {
          setOpen(false);
        }
      }, delay);
    }
  }, [mouseOnPopup]);

  if (!element.data.position) {
    return <></>;
  }

  let marker = element.data.map_marker
    ? element.data.map_marker
    : markers["bush.png"];
  // if the value is not in the map, use the default marker
  if (!markers[marker]) {
    marker = markers["bush.png"];
  }
  const icon = new Icon({
    iconUrl: marker,
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
      ref={(ref) => {
        setTimeout(() => ref?.openPopup(), 500);
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
        {open ? (
          <>
            <Element
              data={element.data}
              id={element.id}
              lang={lang}
              className="w-[11rem]"
            />
          </>
        ) : (
          element.data[lang].name
        )}
      </Popup>
    </Marker>
  );
}

export function MapWithArticles({ lang, initPosition}: { lang: (typeof locales)[number], initPosition?: Position}) {
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
  }, []);
  const [elements_data, set_elements_data] = useState<
    { data: PlantData; id: string }[]
  >([]);
  const [date, setDate] = useState(0);
  const element_per_batch = 10;
  useEffect(() => {
    getDocs(
      query(
        collectionRef,
        where("disable_map_position", "==", false),
        limit(element_per_batch),
        orderBy("date"),
        startAfter(date),
      ),
    ).then((q) => {
      const ele = q.docs.map((doc) => {
        return { data: doc.data() as PlantData, id: doc.id };
      });
      if (ele.length === 0) {
        return;
      }
      set_elements_data([...elements_data, ...ele]);
      setDate(ele[ele.length - 1].data.date);
    });
  }, [date]);
  let elements = elements_data.map((element) => (
    <ArticleMarker
      element={element}
      lang={lang}
      key={element.id}
      markers={markers}
    />
  ));
  if (initPosition) {
    return <MapViewer
    initPosition={initPosition}
    
    >{elements}</MapViewer>;
  }

  return <MapViewer>{elements}</MapViewer>;
}
