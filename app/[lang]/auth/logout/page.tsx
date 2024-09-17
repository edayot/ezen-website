"use client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { useTranslation } from "@/dictionaries/client";

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <div>{t["auth.logout"]}</div>
    </div>
  );
}
