"use client";
import { useTranslation } from "@/dictionaries/client";
import { footerRef } from "@/utils/firebase";
import { FooterData } from "@/utils/footer";
import { locales } from "@/utils/langs";
import { getDocs } from "@firebase/firestore";
import { Image, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiGithub } from "react-icons/fi";

export function RenderFooter({
  data,
  lang,
}: {
  data: FooterData;
  lang: (typeof locales)[number];
}) {
  if (data.url.trim() === "") {
    return <></>;
  }
  const specialIcon: Record<string, JSX.Element> = {
    "special:github": <FiGithub size={12} />,
  };
  const alt = data.tooltip ? data.tooltip[lang] : "";
  const button = (
    <Link href={data.url}>
      <motion.button
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.95 }}
        className="w-full h-full"
      >
        {specialIcon[data.icon] ? (
          specialIcon[data.icon]
        ) : (
          <Image src={data.icon} width={16} height={16} alt={alt} />
        )}
      </motion.button>
    </Link>
  );

  if (data.tooltip && data.tooltip[lang]) {
    return (
      <Tooltip content={data.tooltip[lang]} placement="top">
        {button}
      </Tooltip>
    );
  }
  return button;
}

export function Footer({ lang }: { lang: (typeof locales)[number] }) {
  const t = useTranslation();
  const [data, setData] = useState<FooterData[]>([
    {
      icon: "special:github",
      url: "https://github.com/edayot/ezen-website",
    },
  ]);
  useEffect(() => {
    getDocs(footerRef).then((q) => {
      setData(q.docs.map((doc) => doc.data() as FooterData));
    });
  }, []);

  const orderedData = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="w-full">
      <div className="bg-default/60 backdrop-blur-sm border-default/60 border">
        <div className="flex flex-row justify-between items-center my-[0.15rem] mx-16">
          <div className="flex flex-row justify-start text-[10px]">
            {t["footer.madeBy"]}
          </div>

          <div className="flex flex-row justify-end mx-2 my-1">
            {orderedData
              ? orderedData.map((d, i) => (
                  <RenderFooter data={d} lang={lang} key={i} />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
