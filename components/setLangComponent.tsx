"use client";

import { setLocaleCookie } from "@/components/setLang";
import { useEffect } from "react";

export function SetLangComponent({ locale }: { locale: string }) {
  useEffect(() => {
    setLocaleCookie(locale);
  }, [locale]);
  return null;
}
