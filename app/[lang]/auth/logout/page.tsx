"use client";
import { useTranslation } from "@/dictionaries/client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { signOutGlobal } from "@/utils/firebase";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  useEffect(() => {
    signOutGlobal().then(redirect("/"));
  }, []);
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <div>{t["auth.logout"]}</div>
    </div>
  );
}
