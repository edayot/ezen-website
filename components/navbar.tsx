"use client";

import {Image} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import { ThemeSwitch } from "./themes/Switch";
import React from "react";
import { FiHome, FiBookOpen, FiInfo, FiUser} from "react-icons/fi";



function NavBarLeftContent({size}: {size: number}) {
    return (
        <>
            <NavbarItem isActive>
                <Link href="/">
                    <FiHome size={size} />
                </Link>
            </NavbarItem>
            <NavbarItem isActive>
                <Link href="/articles">
                    <FiBookOpen size={size} />
                </Link>
            </NavbarItem>
            <NavbarItem isActive>
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
                <ThemeSwitch props={{size}} />
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
                <Image src="/favicon.ico" alt="Ezen Garden" width="60" height="60" />
            </Link>
        </NavbarBrand>
    );
}
        


export default function NavbarComponent(dict: any) {
    const size = 24;
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
