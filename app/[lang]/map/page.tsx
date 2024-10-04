"use client";
import { lazy } from "react";
const MapWithArticles = lazy(() => import("@/components/map/AllMarkers")
  .then((mod) => ({ default: mod.MapWithArticles }))
);
import { HomeProps } from "@/dictionaries/dictionaries";
import { Position } from "@/utils/article";
import { useState, useEffect } from "react";

export default function Home({
  params,
  searchParams,
}: {
  params: HomeProps;
  searchParams: {
    bound00?: string;
    bound01?: string;
    bound10?: string;
    bound11?: string;
  };
}) {
  let bounds : any = undefined
  if (
    searchParams.bound00 &&
    searchParams.bound01 &&
    searchParams.bound10 &&
    searchParams.bound11
  ) {
    bounds = [
      {
        x: parseFloat(searchParams.bound00),
        y: parseFloat(searchParams.bound01),
      } as Position,
      {
        x: parseFloat(searchParams.bound10),
        y: parseFloat(searchParams.bound11),
      } as Position,
    ]
  }
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return <></>
  }
  return (
    <div className="w-screen fixed top-16 bottom-0">
      <MapWithArticles lang={params.lang} initBounds={bounds} />
    </div>
  );
}
