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
import {
  FiHome,
  FiBookOpen,
  FiMap,
  FiUser,
  FiLogOut,
  FiGlobe,
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import { locales } from "@/langs";
import { useTranslation } from "@/dictionaries/client";
import { IsUserLoggedIn } from "./RedirectButton";

function NavBarLeftContent({ size }: { size: number }) {
  const path = "/" + usePathname().split("/").slice(2).join("/");
  return (
    <>
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

export const langToFlag: Record<string, JSX.Element> = {
  en: <Avatar alt="en" size="sm" src="https://flagcdn.com/gb.svg" />,
  fr: <Avatar alt="fr" size="sm" src="https://flagcdn.com/fr.svg" />,
  it: <Avatar alt="it" size="sm" src="https://flagcdn.com/it.svg" />,
};

export function LangSwitch({
  size,
  lang,
  handleClick,
}: {
  size: number;
  lang: (typeof locales)[number];
  handleClick: (lang: string) => void;
}) {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([lang]),
  );
  const t = useTranslation();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="sm"
          variant="bordered"
          isIconOnly
          className="flex items-center justify-center rounded-lg bg-default-100 hover:bg-default-200 cursor-pointer border-2 size-4"
        >
          <FiGlobe size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onAction={(key) => handleClick(key.toString())}
      >
        {locales.map((lang) => (
          <DropdownItem key={lang}>
            <div className="flex flex-row items-center gap-4">
              {langToFlag[lang]} {t[`navbar.lang_switch.${lang}`]}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

function NavBarRightContent({
  size,
  lang,
}: {
  size: number;
  lang: (typeof locales)[number];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (lang: string) => {
    const pathWitoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${lang}/${pathWitoutLocale}`;
    router.push(newPath);
  };

  return (
    <>
      <NavbarItem className="lg:flex">
        <div className=" relative bottom-[2px]">
          <LangSwitch size={size} lang={lang} handleClick={handleClick} />
        </div>
      </NavbarItem>
      <NavbarItem className="lg:flex">
        <div className=" relative bottom-[2px]">
          <ThemeSwitch props={{ size: size }} />
        </div>
      </NavbarItem>
      <NavbarItem className="lg:flex">
        <IsUserLoggedIn
          fallback={
            <Link href="/auth/login">
              <FiUser size={size} />
            </Link>
          }
        >
          <Link href="/auth/account">
            <FiUser size={size} />
          </Link>
        </IsUserLoggedIn>
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

export default function NavbarComponent({
  lang,
}: {
  lang: (typeof locales)[number];
}) {
  const size = 28;
  return (
    <>
      <Navbar className="dark:bg-white/5 " isBlurred>
        <NavbarContent justify="start">
          <NavBarLogo />
        </NavbarContent>
        <NavbarContent justify="center" className="gap-1 sm:gap-4">
          <NavBarLeftContent size={size} />
        </NavbarContent>
        <NavbarContent justify="end" className="gap-1 sm:gap-4">
          <NavBarRightContent size={size} lang={lang} />
        </NavbarContent>
      </Navbar>
    </>
  );
}
