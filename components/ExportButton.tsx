"use client";
import { PlantData } from "@/utils/article";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useRef } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { FiCode } from "react-icons/fi";
import {QRCode} from "react-qrcode-logo";
import { langToFlag } from "./NavBar";
import { useTranslation } from "@/dictionaries/client";
import { locales } from "@/utils/langs";
import Image from "next/image";




function Article({data}: {data: PlantData}) {
  return (<>
    <p className="text-sm text-black font-sans italic">
      {data.latin_name}
    </p>
    <p className="text-xl text-black font-sans font-bold">
      {data.it.name}
    </p>
    <p className="text-sm text-black font-sans">
      {data.it.desc.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      )
      )}
    </p>
    </>)
}

function BottomQRCode({url}: {url: string}) {
  const fullArticle = {
    fr: "Article en entier sur :",
    en: "Full article on :",
    it: "Articolo completo su :",
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
const ComponentToPrint = React.forwardRef((props: {url: string, data: PlantData}, ref: any) => {
  const t = useTranslation();

  return (
  <div ref={ref}>
    <div className="bg-white w-[36rem] h-[46rem] p-16">
      <div className="flex flex-col justify-between gap-2 h-full">
      <div className="flex-grow overflow-hidden relative">
        <Article data={props.data}/>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
        <div className="mt-auto">
          <BottomQRCode url={props.url}/>
        </div>
      </div>
    </div>
  </div>
  
)
});

ComponentToPrint.displayName = "ComponentToPrint";

export function ExportButton({ id , data }: { id: string, data: PlantData }) {
  const url = `https://ezen-website.vercel.app/article/${id}`;
  const qrRef = useRef(null);

  // Define the export function to capture the QR code as an image
  const generate = () => {
    exportComponentAsPNG(qrRef, { fileName: "qr-code.png" });
  };

  return (
    <>
      {/* Display the QRCode only when exporting */}
      <div style={{ position: "absolute", left: "-1000000px", top: "100px" }}>
        <ComponentToPrint ref={qrRef} url={url} data={data} />
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
