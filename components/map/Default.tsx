"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  ImageOverlay,
} from "react-leaflet";
import { constants } from "fs/promises";
import React from "react";

export function MapViewer({
  children,
  setMap,
}: {
  children?: React.ReactNode;
  setMap?: (value: any) => void;
}) {
  const [size, setSize] = useState<[number, number]>([-1, -1]);
  const img_path = "/images/map.jpg";
  const bounds: [number, number][] = [[0, 0], size];
  const bounds_factor = 10;
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
      center={[0, 0]}
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
