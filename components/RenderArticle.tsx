"use client";

import { PlantData } from "@/utils/article";
import { locales } from "@/utils/langs";
import { Image } from "@nextui-org/react";
import MarkdownRender from "@/components/MarkdownRender";

export default function RenderArticle({
  data,
  lang,
}: {
  data: PlantData;
  lang: (typeof locales)[number];
}) {
  let latin_name = "";
  if (data.latin_name && data.latin_name.trim() !== "") {
    latin_name = `(${data.latin_name})`
  }
  return (
    <div className="flex flex-row justify-center">
      <div className="w-5/6 max-w-xl">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-center items-center">
            {data.image !== "" ? (
              <Image
              src={data.image}
              alt={data[lang].name}
              width="100%"
              height="auto"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-xl font-sans font-bold">
              {data[lang].name}
            </h1>
            <p className="text-sm font-sans italic">
              {latin_name}
            </p>
          </div>
          <div className="my-markdown-container">
            <MarkdownRender>{data[lang].desc}</MarkdownRender>
            </div>
        </div>
      </div>
    </div>
  );
}
