import { locales } from "@/utils/langs";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const deploy_url = "https://ezen-website.vercel.app";

  let res: MetadataRoute.Sitemap = [];
  locales.forEach((lang) => {
    res.push({
      url: `${deploy_url}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  });
  locales.forEach((lang) => {
    res.push({
      url: `${deploy_url}/${lang}/articles`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    });
    res.push({
      url: `${deploy_url}/${lang}/map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    });
  });
  return res;
}
