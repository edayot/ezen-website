import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "leaflet/dist/leaflet.css";
import { HomeProps } from "@/dictionaries/dictionaries";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NavBar from "@/components/navbar";
import { getDictionary } from "@/dictionaries/dictionaries";
import { SetLangComponent } from "../setLangComponent";
import { LeafletProvider } from "@/components/LeafletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ezen Garden",
  description: "An interactive website to discover the Ezen Garden",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: HomeProps;
}) {
  const dict = await getDictionary(params.lang);
  return (
    <html>
      <head>
      </head>
      <body className={inter.className}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <div className="flex flex-col min-h-screen">
              <SetLangComponent locale={params.lang} />
              <LeafletProvider>
                <div>
                  <NavBar {...dict} />
                </div>
                <div className="grow">
                  {children}
                </div>
              </LeafletProvider>
            </div>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
