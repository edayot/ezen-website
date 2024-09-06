"use client";
import { useState } from "react";
import { Image } from "@nextui-org/react";



export function MapViewer() {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    
    return <div className="">
        <Image src="/images/map.jpg" alt="Map" className="h-52"/>
    </div>
}