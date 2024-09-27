"use client";
import { useTranslation } from "@/dictionaries/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";

export function Footer({}) {
  const t = useTranslation();

  return (
    <div className="w-full bg-default/80">
      <div className="flex flex-row justify-between items-center m-[0.15rem]">
        <div className="flex flex-row justify-start text-[12px]">
          {t["footer.madeBy"]}
        </div>

        <div className="flex flex-row justify-end mx-2 my-1">
          <div className="">
            <Link href="https://github.com/edayot/ezen-website">
              <motion.button
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.95 }}
                className="w-full h-full"
              >
                <FiGithub size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
