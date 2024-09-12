"use client";

import { Image } from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { ThemeSwitch } from "./themes/Switch";
import React from "react";
import { FiHome, FiBookOpen, FiMap, FiUser, FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";

function NavBarLeftContent({ size }: { size: number }) {
  const path = "/" + usePathname().split("/").slice(2).join("/");
  return (
    <>
      <NavbarItem isActive={path === "/"}>
        <Link href="/">
          <FiHome size={size} />
        </Link>
      </NavbarItem>
      <NavbarItem isActive={path === "/articles"}>
        <Link href="/articles">
          <FiBookOpen size={size} />
        </Link>
      </NavbarItem>
      <NavbarItem isActive={path === "/map"}>
        <Link href="/map">
          <FiMap size={size} />
        </Link>
      </NavbarItem>
    </>
  );
}

function NavBarRightContent({ size }: { size: number }) {
  return (
    <>
      <NavbarItem className="lg:flex">
        <div className=" relative bottom-[2px]">
        <ThemeSwitch props={{ size: size }} />
        </div>
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
        <Image
          className="w-12 h-12"
          src="/favicon.ico"
          alt="Ezen Garden"
          isBlurred
        />
      </Link>
    </NavbarBrand>
  );
}

export default function NavbarComponent(dict: any) {
  const size = 28;
  dict = { ...dict, size };
  return (
    <>
      <Navbar className="dark:bg-white/5 " isBlurred>
        <NavbarContent justify="start">
          <NavBarLogo />
        </NavbarContent>
        <NavbarContent justify="center">
          <NavBarLeftContent {...dict} />
        </NavbarContent>
        <NavbarContent justify="end">
          <NavBarRightContent {...dict} />
        </NavbarContent>
      </Navbar>
    </>
  );
}
