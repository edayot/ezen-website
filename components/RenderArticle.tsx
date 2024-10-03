"use client";

import { PlantData } from "@/utils/article";
import { locales } from "@/utils/langs";
import { Image } from "@nextui-org/react";
import MarkdownRender from "./MarkdownRender";

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
          <div className="my-markdown-container">
            <MarkdownRender>{data[lang].desc}</MarkdownRender>
            </div>
        </div>
      </div>
    </div>
  );
}
