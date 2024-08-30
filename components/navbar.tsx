"use client";

import Image from "next/image";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import { ThemeSwitch } from "./themes/Switch";
import React from "react";
import { FiHome, FiBookOpen, FiInfo, FiUser} from "react-icons/fi";
import { usePathname } from 'next/navigation'

import Logo from "@/public/favicon.png";




function NavBarLeftContent({size}: {size: number}) {
    const path = "/" + usePathname().split("/").slice(2).join("/")
    return (
        <>
            <NavbarItem isActive={path==="/"}>
                <Link href="/">
                    <FiHome size={size} />
                </Link>
            </NavbarItem>
            <NavbarItem isActive={path==="/articles"}>
                <Link href="/articles">
                    <FiBookOpen size={size} />
                </Link>
            </NavbarItem>
            <NavbarItem isActive={path==="/contact"}>
                <Link href="/contact">
                    <FiInfo size={size} />
                </Link>
            </NavbarItem>
        </>
    );
}

function NavBarRightContent({size}: {size: number}) {
    return (
        <>
            <NavbarItem className="lg:flex">
                <ThemeSwitch props={{size:size}} />
            </NavbarItem>
            <NavbarItem className="lg:flex">
                <Link href="/auth/login">
                    <FiUser size={size} />
                </Link>
            </NavbarItem>
        </>
    );
}


function NavBarLogo() {
    return (
        <NavbarBrand>
            <Link href="/">
                <Image src={Logo} alt="Ezen Garden" height={50} width={50}/>
            </Link>
        </NavbarBrand>
    );
}
        


export default function NavbarComponent(dict: any) {
    const size = 28;
    dict = {...dict, size};
    return (
    <>
    <Navbar>
        <NavbarContent className="flex" justify="start">
            <NavBarLogo/>
        </NavbarContent>
        <NavbarContent justify="center" className="gap-6">
            <NavBarLeftContent {...dict}/>
        </NavbarContent>
        <NavbarContent justify="end" className="gap-6">
            <NavBarRightContent {...dict}/>
        </NavbarContent>
    </Navbar>
    </>
  );
}
