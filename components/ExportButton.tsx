"use client";
import MarkdownRender from "@/components/MarkdownRender";
import { PlantData } from "@/utils/article";
import { defaultLocale } from "@/utils/langs";
import { useToPng } from "@hugocxl/react-to-image";
import { Button, Tooltip } from "@nextui-org/react";
import { QRCodeSVG } from "qrcode.react";
import { FiCode } from "react-icons/fi";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

function Article({ data }: { data: PlantData }) {
  let latin_name = "";
  if (data.latin_name && data.latin_name.trim() !== "") {
    latin_name = `(${data.latin_name})`;
  }
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <p className="text-xl text-black font-sans font-bold">
          {data[defaultLocale].name}
        </p>
        <p className="text-sm text-black font-sans italic">{latin_name}</p>
      </div>
      <br />
      <div className="text-sm text-black font-sans text-justify disable-image	">
        <MarkdownRender disable_img>
          {data[defaultLocale].desc}
        </MarkdownRender>
      </div>
    </>
  );
}

function ComponentToPrint({ url, data }: { url: string; data: PlantData }) {
  // QRCode is at the top right corner
  return (
    <div className="bg-white w-[36rem] h-[46rem] p-16">
      <div className="flex flex-col justify-between gap-2 h-full">
        <div className="flex-grow overflow-hidden relative">
          <div className="float-right ml-4">
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
          <Article data={data} />
        </div>
      </div>
    </div>
  );
}

export function ExportButton({ id, data }: { id: string; data: PlantData }) {
  let url = `https://ezen-website.vercel.app/article/${id}`;
  if (id === "home") {
    url = `https://ezen-website.vercel.app/`;
  }

  const [_, convertToPngFull, fullRef] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      // make the user download the image
      // data is a base64 encoded image
      const link = document.createElement("a");
      link.download = "FullArticle.png";
      link.href = data;
      link.click();
    },
  });
  const [__, convertToPngSmall, smallRef] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      // make the user download the image
      // data is a base64 encoded image
      const link = document.createElement("a");
      link.download = "QRCodeWithName.png";
      link.href = data;
      link.click();
    },
  });
  const [___, convertToPngXs, xsRef] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      // make the user download the image
      // data is a base64 encoded image
      const link = document.createElement("a");
      link.download = "QRCodeOnly.png";
      link.href = data;
      link.click();
    },
  });

  const onAction = (key: string | number): void => {
    const a: Record<string, () => void> = {
      full: convertToPngFull,
      small: convertToPngSmall,
      xs: convertToPngXs,
    };
    a[key]();
  };

  return (
    <>
      <div style={{ position: "absolute", left: "100px", top: "600px" }}>
        <div ref={fullRef}>
          <ComponentToPrint url={url} data={data} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "-5000000px", top: "100px" }}>
        <div ref={smallRef}>
          <div className="p-4 bg-white flex flex-col justify-center items-center h-[24rem] w-[24rem]">
            <p className="text-sm text-black font-sans italic">
              {data.latin_name}
            </p>
            <p className="text-xl text-black font-sans font-bold">
              {data[defaultLocale].name}
            </p>
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              imageSettings={{
                src: "/favicon.ico",
                height: 32,
                width: 32,
                excavate: false,
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "-9000000px", top: "100px" }}>
        <div ref={xsRef}>
          <div className="p-4 bg-white flex justify-center items-center h-[24rem] w-[24rem]">
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              imageSettings={{
                src: "/favicon.ico",
                height: 32,
                width: 32,
                excavate: false,
              }}
            />
          </div>
        </div>
      </div>
      <Dropdown>
        <Tooltip content="Generate QRCode" placement="top">
          <div>
            <DropdownTrigger>
              <Button isIconOnly>
                <FiCode />
              </Button>
            </DropdownTrigger>
          </div>
        </Tooltip>
        <DropdownMenu aria-label="Static Actions" onAction={onAction}>
          <DropdownItem key="full">Full article</DropdownItem>
          <DropdownItem key="small">QR code with name</DropdownItem>
          <DropdownItem key="xs">Only QRCode</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
