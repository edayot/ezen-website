"use server";
import { HomeProps } from "@/dictionaries/dictionaries";
import PageRender from "@/app/[lang]/article/[name]/page"

export default async function Home({ params }: { params: HomeProps }) {
  params.name = "home"
  return <></>
  const page = await PageRender({params})
  return page
}
