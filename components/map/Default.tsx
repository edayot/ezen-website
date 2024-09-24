"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  ImageOverlay,
} from "react-leaflet";
import React from "react";
import { Position } from "@/utils/article";



export function MapViewer({
  children,
  setMap,
  initPosition,
}: {
  children?: React.ReactNode;
  setMap?: (value: any) => void;
  initPosition?: Position
}) {
  const [size, setSize] = useState<[number, number]>([-1, -1]);
  const img_path = "/images/map.jpg";
  let bounds: [number, number][] = [[0, 0], size];
  if (initPosition) {
    const factor = 4;
    bounds = [
      [initPosition.x - factor, initPosition.y - factor],
      [initPosition.x + factor, initPosition.y + factor]
    ]
  }
  const bounds_factor = 30;
  const maxBounds: [number, number][] = [
    [bounds[0][0] - bounds_factor, bounds[0][1] - bounds_factor],
    [bounds[1][0] + bounds_factor, bounds[1][1] + bounds_factor],
  ];

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const clamp = 25;
      setSize([clamp, (img.width / img.height) * clamp]);
    };
    img.src = img_path;
  }, [img_path]);
  if (size[0] === -1 || size[1] === -1) {
    return <></>;
  }

  return (
    <MapContainer
      boxZoom
      bounds={bounds}
      maxBounds={maxBounds}
      className="h-full w-full"
      ref={(value: any) => {
        if (setMap) {
          setMap(value);
        }
      }}
    >
      <ImageOverlay
        bounds={[[0, 0], size]}
        url={img_path}
        className="map_main aspect-auto"
      />
      {children}
    </MapContainer>
  );
}
