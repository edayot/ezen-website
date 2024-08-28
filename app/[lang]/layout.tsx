import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { HomeProps } from '@/dictionaries/dictionaries'
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import NavbarComponent from "@/components/navbar";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ezen Garden",
  description: "An interactive website to discover the Ezen Garden",
};

export default async function RootLayout(
  {
    children,
    params,
  }: {
    children: React.ReactNode;
    params: HomeProps;
  }
) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <NavbarComponent params={params}/>
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
    
  );
}
