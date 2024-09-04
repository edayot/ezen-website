"use client";

import { setLocaleCookie } from "@/app/setLang";
import { useEffect } from "react";

export function SetLangComponent({ locale }: { locale: string }) {
  useEffect(() => {
    setLocaleCookie(locale);
  }, [locale]);
  return null;
}
