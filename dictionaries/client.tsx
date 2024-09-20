"use client";
import React, { createContext, useContext } from "react";
import { createProxy } from "@/dictionaries/proxy";

// Create the context with a default value of an empty object
const TranslationContext = createContext({} as any);

// useTranslation hook to access the dictionary from the context
export function useTranslation() {
  const dict = useContext(TranslationContext);
  return createProxy(dict); // Use the createProxy function with the dictionary
}

// TranslationProvider component to provide the dictionary via context
export function TranslationProvider({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: any;
}) {
  return (
    <TranslationContext.Provider value={dict}>
      {children}
    </TranslationContext.Provider>
  );
}
