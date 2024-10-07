"use client";
import { Element } from "@/components/ArticleCard";
import { IsUserLoggedIn } from "@/components/RedirectButton";
import { PlantData, Position } from "@/utils/article";
import { collectionRef, storage } from "@/utils/firebase";
import { locales } from "@/utils/langs";
import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "@firebase/firestore";
import { useToPng } from "@hugocxl/react-to-image";
import { Button, Card, CardBody, Snippet } from "@nextui-org/react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { Icon } from "leaflet";
import { QRCodeSVG } from "qrcode.react";
import { lazy, useEffect, useState } from "react";
import { Marker, Popup, Rectangle } from "react-leaflet";
const MapViewer = lazy(() =>
  import("@/components/map/Default").then((mod) => ({
    default: mod.MapViewer,
  })),
);

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
  const [delay, setDelay] = useState(1000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(pointer: coarse)").matches) {
        setDelay(50);
      }
    }
  }, []);

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
  if (!marker.startsWith("http")) {
    marker = markers[marker];
    if (!marker) {
      marker = markers["bush.png"];
    }
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
      autoPan={false}
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

export function MapWithArticles({
  lang,
  initBounds,
}: {
  lang: (typeof locales)[number];
  initBounds?: [Position, Position];
}) {
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
  const [childs, setChilds] = useState<React.ReactNode[]>([]);
  const [date, setDate] = useState(0);
  const [map, setMap] = useState<any>(null);
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

  let data = elements_data;
  if (initBounds) {
    const minX = Math.min(initBounds[0].x, initBounds[1].x);
    const minY = Math.min(initBounds[0].y, initBounds[1].y);
    const maxX = Math.max(initBounds[0].x, initBounds[1].x);
    const maxY = Math.max(initBounds[0].y, initBounds[1].y);

    data = elements_data.filter((element) => {
      if (element.data.position) {
        return (
          element.data.position.x >= minX &&
          element.data.position.x <= maxX &&
          element.data.position.y >= minY &&
          element.data.position.y <= maxY
        );
      }
      return false;
    });
  }
  let elements = data.map((element) => (
    <ArticleMarker
      element={element}
      lang={lang}
      key={element.id}
      markers={markers}
    />
  ));

  return (
    <>
      <MapViewer setMap={setMap} initBounds={initBounds}>
        {elements}
        {childs}
      </MapViewer>
      <IsUserLoggedIn>
        <CreateCubiqueMapURL childs={childs} setChilds={setChilds} />
      </IsUserLoggedIn>
    </>
  );
}

// Define the QR code component with a forwardRef
function ComponentToPrint({ url }: { url: string }) {
  return (
    <div className="p-4 bg-white flex justify-center items-center h-[24rem] w-[24rem]">
      <QRCodeSVG
        value={url}
        size={128}
        level="H"
        imageSettings={{
          src: "/favicon.ico",
          height: 32,
          width: 32,
          excavate: false,
        }}
      />
    </div>
  );
}

function CreateCubiqueMapURL({
  childs,
  setChilds,
}: {
  childs: React.ReactNode[];
  setChilds: (childs: React.ReactNode[]) => void;
}) {
  const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      // make the user download the image
      // data is a base64 encoded image
      const link = document.createElement("a");
      link.download = "QRCode.png";
      link.href = data;
      link.click();
    },
  });
  const [open, setOpen] = useState(false);
  const [pos1, setPos1] = useState<[number, number]>([0, 0]);
  const [pos2, setPos2] = useState<[number, number]>([10, 10]);
  const [bounds, setBounds] = useState<[number, number][]>([
    [0, 0],
    [10, 10],
  ]);

  const marker1 = (
    <Marker
      position={pos1}
      draggable={true}
      eventHandlers={{
        move: (e) => {
          setPos1([e.target.getLatLng().lat, e.target.getLatLng().lng]);
          setBounds([
            [e.target.getLatLng().lat, e.target.getLatLng().lng],
            bounds[1],
          ]);
        },
      }}
    />
  );
  const marker2 = (
    <Marker
      position={pos2}
      draggable={true}
      eventHandlers={{
        move: (e) => {
          setPos2([e.target.getLatLng().lat, e.target.getLatLng().lng]);
          setBounds([
            bounds[0],
            [e.target.getLatLng().lat, e.target.getLatLng().lng],
          ]);
        },
      }}
    />
  );
  const rectangle = <Rectangle bounds={bounds} />;

  useEffect(() => {
    if (open) {
      setChilds([marker1, marker2, rectangle]);
    }
  }, [bounds, pos1, pos2]);

  const onClick = () => {
    setOpen(true);
    // add two draggeable marker + a rectangle
    setChilds([marker1, marker2, rectangle]);
  };

  let copyURL = `https://ezen-website.vercel.app/map?bound00=${bounds[0][0]}&bound01=${bounds[0][1]}&bound10=${bounds[1][0]}&bound11=${bounds[1][1]}`;

  return (
    <>
      <div className="absolute top-0 right-0 z-[1000000000000000000]">
        <Card>
          <CardBody className=" flex flex-col m-2 gap-2">
            <Button onClick={onClick}>Create bounding box</Button>

            {open ? (
              <>
                <div ref={ref}>
                  <ComponentToPrint url={copyURL} />
                </div>
                <Snippet symbol="" codeString={copyURL} size="sm">
                  {copyURL.slice(0, 56)}...
                </Snippet>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setChilds([]);
                    convertToPng();
                  }}
                >
                  Close and download QR Code
                </Button>
              </>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
