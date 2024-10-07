"use client";

import { useTranslation } from "@/dictionaries/client";
import { Position } from "@/utils/article";
import { locales } from "@/utils/langs";
import {
  Button,
  Modal,
  ModalContent,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { lazy } from "react";
import { FiMap } from "react-icons/fi";
const MapWithArticles = lazy(() =>
  import("@/components/map/AllMarkers").then((mod) => ({
    default: mod.MapWithArticles,
  })),
);

export function ToMapButton({
  pos,
  lang,
}: {
  pos: Position;
  lang: (typeof locales)[number];
}) {
  const t = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const factor = 4;
  pos.x = Number(pos.x);
  pos.y = Number(pos.y);
  const bounds: [Position, Position] = [
    { x: pos.x - factor, y: pos.y - factor },
    { x: pos.x + factor, y: pos.y + factor },
  ];

  return (
    <>
      <Tooltip content={t["articles.map_button"]} placement="bottom">
        <Button isIconOnly onPress={onOpen}>
          <FiMap />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <div className="flex items-center justify-center border border-red-600">
            <div className="w-screen h-screen">
              <MapWithArticles lang={lang} initBounds={bounds} />
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
