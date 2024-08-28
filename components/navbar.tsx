import Image from "next/image";
import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { ThemeSwitch } from "./themes/Switch";


export default async function NavbarComponent(
  {
    params: { lang },
  }: {
    params: HomeProps;
  }
) {
    const dict = await getDictionary(lang);
    return (
    
    <Navbar>
        <NavbarContent className="hidden sm:flex gap-4" justify="start">
            <NavbarBrand>
            <Image src="/favicon.ico" alt="Ezen Garden" width="60" height="60" />
            </NavbarBrand>
            <NavbarItem isActive>
            <Link href="/">
                {dict.navbar.home}
            </Link>
            </NavbarItem>
            <NavbarItem isActive>
            <Link href="/articles">
                {dict.navbar.articles}
            </Link>
            </NavbarItem>
            <NavbarItem isActive>
            <Link href="/contact">
                {dict.navbar.contact}
            </Link>
            </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
                <ThemeSwitch/>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
            <Link href="/auth/login">
                {dict.navbar.login}
            </Link>
            </NavbarItem>
        </NavbarContent>
    </Navbar>    
  );
}
