"use client";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useRef } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { FiCode } from "react-icons/fi";
import QRCode from "react-qr-code";

// Define the QR code component with a forwardRef
const ComponentToPrint = React.forwardRef((props: any, ref: any) => (
  <div ref={ref} style={{ background: "white", padding: "16px" }}>
    <QRCode value={props.url} />
  </div>
));

ComponentToPrint.displayName = "ComponentToPrint";

export function ExportButton({ id }: { id: string }) {
  const url = `https://ezen-website.vercel.app/article/${id}`;
  const qrRef = useRef(null);

  // Define the export function to capture the QR code as an image
  const generate = () => {
    exportComponentAsPNG(qrRef, { fileName: "qr-code.png" });
  };

  return (
    <>
      {/* Display the QRCode only when exporting */}
      <div style={{ position: "absolute", left: "-1000px", top: "-1000px" }}>
        <ComponentToPrint ref={qrRef} url={url} />
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
