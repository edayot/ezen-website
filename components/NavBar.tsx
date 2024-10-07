"use client";

import { IsUserLoggedIn } from "@/components/RedirectButton";
import { ThemeSwitch } from "@/components/themes/Switch";
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
import { GenIcon, IconType } from "react-icons";
import { FiBookOpen, FiGlobe, FiMap, FiUser } from "react-icons/fi";

const FiWhatsApp: IconType = (props: any) => {
  return GenIcon({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M21 11.5a8.37 8.37 0 0 1-.9 3.8 8.49 8.49 0 0 1-7.6 4.7 8.37 8.37 0 0 1-3.8-.9L3 21l1.9-5.7a8.37 8.37 0 0 1-.9-3.8 8.49 8.49 0 0 1 4.7-7.6 8.37 8.37 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8Z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M9.49 10a7.58 7.58 0 0 0 .72 1.42A8 8 0 0 0 14 14.5M9.49 10a7.47 7.47 0 0 1-.4-1.4.51.51 0 0 1 .52-.6h0a.54.54 0 0 1 .51.37l.38 1.13ZM14 14.5a7.8 7.8 0 0 0 1.43.41.51.51 0 0 0 .6-.52h0a.54.54 0 0 0-.37-.51l-1.16-.38Z",
        },
        child: [],
      },
    ],
  })(props);
};

function NavBarLeftContent({ size }: { size: number }) {
  const t = useTranslation();
  return (
    <>
      <NavbarItem>
        <Tooltip content={t["navbar.whatsapp"]} placement="bottom">
          <Link href="https://wa.me/message/P6OJB25ZRPTSB1">
            <FiWhatsApp size={30} color="#25D366" />
          </Link>
        </Tooltip>
      </NavbarItem>
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

export const langToFlag: Record<(typeof locales)[number], JSX.Element> = {
  en: <Avatar alt="en" size="sm" src="https://flagcdn.com/gb.svg" />,
  fr: <Avatar alt="fr" size="sm" src="https://flagcdn.com/fr.svg" />,
  it: <Avatar alt="it" size="sm" src="https://flagcdn.com/it.svg" />,
  es: <Avatar alt="es" size="sm" src="https://flagcdn.com/es.svg" />,
  de: <Avatar alt="de" size="sm" src="https://flagcdn.com/de.svg" />,
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
