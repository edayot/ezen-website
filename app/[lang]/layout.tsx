import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import { getDictionary, HomeProps } from '@/dictionaries/dictionaries'
import {NextUIProvider} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ezen Garden",
  description: "An interactive website to discover the Ezen Garden",
};

export default async function RootLayout(
  {
    children,
    params: { lang },
  }: {
    children: React.ReactNode;
    params: HomeProps;
  }
) {
  const dict = await getDictionary(lang);
  return (
    <html lang={lang}>
      <body className={inter.className}>
      <NextUIProvider>
          <Navbar>
            <NavbarContent className="hidden sm:flex gap-4" justify="start">
              <NavbarBrand>
                <Image src="/favicon.ico" alt="Ezen Garden" width="50" height="50" />
              </NavbarBrand>
              <NavbarItem isActive>
                <Link href="/articles">
                  {dict.navbar.articles}
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/contact">
                  {dict.navbar.contact}
                </Link>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem className="hidden lg:flex">
                <Link href="/auth/login">
                  {dict.navbar.login}
                </Link>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          {children}
        </NextUIProvider>
      </body>
    </html>
    
  );
}
