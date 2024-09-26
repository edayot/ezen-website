"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { FiCode } from "react-icons/fi";
import QRCode from "react-qr-code";

export function ExportButton({ id }: { id: string }) {
  const [QRCodeValue, setQRCodeValue] = useState(<></>);
  const url = `https://ezen-website.vercel.app/article/${id}`;

  const generate = () => {
    setQRCodeValue(<QRCode value={url} />);
  };

  return (
    <>
      {QRCodeValue ? QRCodeValue : <></>}
      <div className="h-2"></div>
      <Tooltip content="Generate QRCode" placement="bottom">
        <Button onClick={generate} isIconOnly>
          <FiCode />
        </Button>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}
