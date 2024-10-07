"use client";
import PageRender from "@/app/[lang]/article/[name]/page";
import { HomeProps } from "@/dictionaries/dictionaries";

export default function Home({ params }: { params: HomeProps }) {
  params.name = "home";
  params.bypass = true;
  const page = PageRender({ params });
  return page;
}
