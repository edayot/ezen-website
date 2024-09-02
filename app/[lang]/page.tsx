"use client";
import { useTranslation } from "@/dictionaries/client";


export default async function Home()
{
  const dict = useTranslation()
  return (
    <>
      Home Page
      <br/>
      {dict.aaaaa.bbb}
    </>
  );
}
