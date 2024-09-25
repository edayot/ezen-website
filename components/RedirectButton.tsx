"use client";
import { auth } from "@/utils/firebase";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { useTranslation } from "@/dictionaries/client";
import { redirect } from "next/navigation";
import { Position } from "@/utils/article";
import { FiMap } from "react-icons/fi";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { MapWithArticles } from "@/components/map/AllMarkers";
import { locales } from "@/langs";

export function IsUserLoggedIn({
  children,
  fallback,
}: {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  if (!user) {
    return <> {fallback || null} </>;
  }

  return <>{children || null}</>;
}

export function EditButton({ id }: { id: string }) {
  const t = useTranslation();
  return (
    <>
      <div className="h-2"></div>
      <Tooltip content={t["articles.edit"]} placement="bottom">
        <Link href={`/articles/edit/${id}`}>
          <Button isIconOnly>
            <FiEdit />
          </Button>
        </Link>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}

export function NewArticle() {
  const t = useTranslation();

  return (
    <>
      <div className="h-2"></div>
      <Tooltip content={t["articles.new.tooltip"]} placement="bottom">
        <Link href={`/articles/new`}>
          <Button isIconOnly>
            <FiPlus size={30} />
          </Button>
        </Link>
      </Tooltip>
      <div className="h-2"></div>
    </>
  );
}

export function ToMapButton( {pos, lang} : {pos: Position, lang: (typeof locales)[number]} ) {
  const t = useTranslation();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <div className="h-2"></div>
      <Tooltip content={t["articles.map_button"]} placement="bottom">
        <Button isIconOnly onPress={onOpen}>
          <FiMap size={30} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <div className="flex items-center justify-center border border-red-600">
            <div className="w-screen h-screen">
              <MapWithArticles lang={lang} initPosition={{ x: Number(pos.x), y: Number(pos.y) }} />
            </div>
          </div>
        </ModalContent>
      </Modal>
      <div className="h-2"></div>
    </>
  );
}

export function RedirectComponent({ href }: { href?: string }) {
  useEffect(() => {
    redirect(href || "/");
  });
  return <></>;
}
