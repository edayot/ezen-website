"use client";
import { useTranslation } from "@/dictionaries/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";

export function Footer({}) {
  const t = useTranslation();

  return (
    <div className="w-full">
      <div className="bg-default/60 backdrop-blur-sm border-default/60 border">
        <div className="flex flex-row justify-between items-center my-[0.15rem] mx-16">
          <div className="flex flex-row justify-start text-[10px]">
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
                  <FiGithub size={12} />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
