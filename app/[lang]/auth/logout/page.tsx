"use client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { useTranslation } from "@/dictionaries/client";
import { useEffect } from "react";
import { signOutGlobal } from "@/utils/firebase";
import { redirect } from "next/navigation"

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  useEffect(() => {
    signOutGlobal().then(
      redirect("/")
    )
  }, [])
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <div>{t["auth.logout"]}</div>
    </div>
  );
}
