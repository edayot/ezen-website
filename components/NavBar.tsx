"use client";

import { useTranslation } from "@/dictionaries/client";
import { locales } from "@/utils/langs";
import type { Selection } from "@nextui-org/react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FiBookOpen, FiGlobe, FiMap, FiUser } from "react-icons/fi";
import { IsUserLoggedIn } from "./RedirectButton";
import { ThemeSwitch } from "./themes/Switch";

function NavBarLeftContent({ size }: { size: number }) {
  const t = useTranslation();
  return (
    <>
      <NavbarItem>
        <Tooltip content={t["navbar.articles"]} placement="bottom">
          <Link href="/articles">
            <FiBookOpen size={size} />
          </Link>
        </Tooltip>
      </NavbarItem>
      <NavbarItem>
        <Tooltip content={t["navbar.map"]} placement="bottom">
          <Link href="/map">
            <FiMap size={size} />
          </Link>
        </Tooltip>
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
          <FiGlobe size={16} />
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
  const t = useTranslation();

  const handleClick = (lang: string) => {
    const pathWitoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${lang}/${pathWitoutLocale}`;
    router.push(newPath);
  };

  return (
    <>
      <NavbarItem className="lg:flex">
        <Tooltip content={t["navbar.lang_switch_tooltip"]} placement="bottom">
          <div className=" relative bottom-[2px]">
            <LangSwitch size={size} lang={lang} handleClick={handleClick} />
          </div>
        </Tooltip>
      </NavbarItem>
      <NavbarItem className="lg:flex">
        <Tooltip content={t["navbar.theme_switch"]} placement="bottom">
          <div className=" relative bottom-[2px]">
            <ThemeSwitch props={{ size: size }} />
          </div>
        </Tooltip>
      </NavbarItem>
      <NavbarItem className="lg:flex">
        <IsUserLoggedIn
          fallback={
            <Tooltip content={t["navbar.login"]} placement="bottom">
              <Link href="/auth/login">
                <FiUser size={size} />
              </Link>
            </Tooltip>
          }
        >
          <Tooltip content={t["navbar.account"]}>
            <Link href="/auth/account">
              <FiUser size={size} />
            </Link>
          </Tooltip>
        </IsUserLoggedIn>
      </NavbarItem>
    </>
  );
}

function NavBarLogo() {
  return (
    <NavbarBrand>
      <Tooltip content="Ezen Garden" placement="bottom">
        <Link href="/">
          <Image
            className="w-12 h-12"
            src="/favicon.ico"
            alt="Ezen Garden"
            isBlurred
          />
        </Link>
      </Tooltip>
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
