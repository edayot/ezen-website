"use server";
import PageRender from "@/app/[lang]/article/[name]/page";
import { HomeProps } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: HomeProps }) {
  params.name = "home";
  params.bypass = true;
  const page = await PageRender({ params });
  return page;
}
