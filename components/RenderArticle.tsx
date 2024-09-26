"use client";

import Markdown from "react-markdown";
import { Image } from "@nextui-org/react";
import { PlantData } from "@/utils/article";
import { locales } from "@/utils/langs";
import { defaultUrlTransform } from "react-markdown";

export default function RenderArticle({
  data,
  lang,
}: {
  data: PlantData;
  lang: (typeof locales)[number];
}) {
  let name = `${data[lang].name} (${data.latin_name})`;
  if (name === " ()") {
    name = "";
  }
  if (data.latin_name === "") {
    name = data[lang].name;
  }
  if (data[lang].name === "") {
    name = data.latin_name;
  }
  const urlTransform = (url: string) => {
    if (url.startsWith("data:image")) {
      return url;
    }
    return defaultUrlTransform(url);
  };
  return (
    <div className="flex flex-row justify-center">
      <div className="w-5/6 max-w-xl">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-center items-center">
            {data.image !== "" ? (
              <Image
                src={data.image}
                alt={name}
                width={data.image_width}
                height={data.image_height}
              />
            ) : (
              <></>
            )}
          </div>
          <h1>{name}</h1>
          <h2>{data[lang].place}</h2>
          <Markdown className=" space-y-5" urlTransform={urlTransform}>
            {data[lang].desc}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
