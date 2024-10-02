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

// Define the QR code component with a forwardRef
const ComponentToPrint = React.forwardRef((props: {url: string, data: PlantData}, ref: any) => {
  const t = useTranslation();

  const fullArticle = {
    fr: "Article en entier sur :",
    en: "Full article on :",
    it: "Articolo completo su :",
  }

  return (
  <div ref={ref}>
    <div className="bg-white aspect-[3/4] w-[34rem]">
      <div className="flex flex-col justify-between gap-2">
        <div className="m-12">
          <p className="text-sm text-black font-sans italic">
            {props.data.latin_name}
          </p>
          <p className="text-xl text-black font-sans font-bold">
            {props.data.it.name}
          </p>
          <p className="text-sm text-black font-sans">
            {props.data.it.desc.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            )
            )}
          </p>
        </div>
        <div className="m-12">
          <div className="flex flex-row justify-between w-full h-full items-center">
            <div className="flex flex-col w-full h-full justify-around gap-4">
              {locales.map((lang) => (
                <div className="flex flex-row gap-2">
                  {langToFlag[lang]}
                  <p className="text-sm text-black font-sans">
                    {fullArticle[lang]}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-row justify-end items-end w-full">
              <QRCode value={props.url} logoImage="/favicon.ico" size={128}/>
            </div>
          </div>
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
      <div style={{ position: "absolute", left: "-10000px", top: "100px" }}>
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
