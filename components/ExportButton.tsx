"use client";
import { PlantData } from "@/utils/article";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useRef } from "react";
import { FiCode } from "react-icons/fi";
import {QRCode} from "react-qrcode-logo";
import { langToFlag } from "@/components/NavBar";
import { useTranslation } from "@/dictionaries/client";
import { locales, defaultLocale } from "@/utils/langs";
import MarkdownRender from "@/components/MarkdownRender";
import { useToPng } from '@hugocxl/react-to-image'




function Article({data}: {data: PlantData}) {
  return (<>
    <p className="text-sm text-black font-sans italic">
      {data.latin_name}
    </p>
    <p className="text-xl text-black font-sans font-bold">
      {data[defaultLocale].name}
    </p>
    <div className="text-sm text-black font-sans">
      <MarkdownRender>
        {data[defaultLocale].desc}
      </MarkdownRender>
    </div>
    </>)
}

function BottomQRCode({url}: {url: string}) {
  const fullArticle = {
    fr: "Article en entier sur :",
    en: "Full article on :",
    it: "Articolo completo su :",
    es: "Artículo completo en :",
    de: "Vollständiger Artikel auf :",
  }
  return (<>
  <div className="flex flex-row justify-between w-full h-full items-center">
    <div className="flex flex-col w-full h-full justify-around gap-4">
      {locales.map((lang) => (
        <div className="flex flex-row gap-2 items-center" key={lang}>
          {langToFlag[lang]}
          <p className="text-sm text-black font-sans">
            {fullArticle[lang]}
          </p>
        </div>
      ))}
    </div>
    <div className="flex flex-row justify-end items-end w-full">
      <QRCode value={url} logoImage="/favicon.ico" size={128}/>
    </div>
  </div>
  </>)
}


// Define the QR code component with a forwardRef
function ComponentToPrint({url, data}: {url: string, data: PlantData}) {

  return (
    <div className="bg-white w-[36rem] h-[46rem] p-16">
      <div className="flex flex-col justify-between gap-2 h-full">
      <div className="flex-grow overflow-hidden relative">
        <Article data={data}/>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
        <div className="mt-auto">
          <BottomQRCode url={url}/>
        </div>
      </div>
    </div>  
)
}


export function ExportButton({ id , data }: { id: string, data: PlantData }) {
  const url = `https://ezen-website.vercel.app/article/${id}`;

  const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
    onSuccess: data => {
      // make the user download the image
      // data is a base64 encoded image
      const link = document.createElement('a')
      link.download = 'QRCode.png'
      link.href = data
      link.click()
    }
  })

  const generate = () => {
    convertToPng()
  }

  return (
    <>
      {/* Display the QRCode only when exporting */}
      <div style={{ position: "absolute", left: "-1000000px", top: "100px" }}>
        <div ref={ref}>
          <ComponentToPrint url={url} data={data} />
        </div>
      </div>

      {/* Tooltip and Button for triggering the download */}
      <Tooltip content="Generate QRCode" placement="bottom">
        <Button onClick={generate} isIconOnly>
          <FiCode />
        </Button>
      </Tooltip>
    </>
  );
}
