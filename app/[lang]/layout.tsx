import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { HomeProps } from '@/dictionaries/dictionaries'
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import NavBar from "@/components/navbar";
import { getDictionary } from "@/dictionaries/dictionaries";



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
  const dict = await getDictionary(params.lang);
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <NavBar {...dict}/>
            <div className="flex flex-row min-h-screen justify-center">
              <div className="w-5/6 max-w-lg">
                {children}
              </div>
            </div>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
