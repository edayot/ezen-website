import type { Metadata } from "next";
import "../globals.css";
import "leaflet/dist/leaflet.css";
import { getDictionary, HomeProps } from "@/dictionaries/dictionaries";
import { NextUIProvider } from "@nextui-org/react";
import NavBar from "@/components/navbar";
import { SetLangComponent } from "../setLangComponent";
import { TranslationProvider } from "@/dictionaries/client";

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
    <NextUIProvider>
      <TranslationProvider dict={dict}>
        <div className="flex flex-col min-h-screen">
          <SetLangComponent locale={params.lang} />
          <div>
            <NavBar lang={params.lang} />
          </div>
          <div className="grow">{children}</div>
        </div>
      </TranslationProvider>
    </NextUIProvider>
  );
}
