"use client";
import { useTranslation } from "@/dictionaries/client";
import { auth } from "@/utils/firebase";
import { Button, Tooltip } from "@nextui-org/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Bounce, toast } from "react-toastify";

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
      <Tooltip content={t["articles.edit"]} placement="bottom">
        <Link href={`/articles/edit/${id}`}>
          <Button isIconOnly>
            <FiEdit />
          </Button>
        </Link>
      </Tooltip>
    </>
  );
}

export function NewArticle() {
  const t = useTranslation();

  return (
    <>
      <Tooltip content={t["articles.new.tooltip"]} placement="bottom">
        <Link href={`/articles/new`}>
          <Button isIconOnly>
            <FiPlus size={30} />
          </Button>
        </Link>
      </Tooltip>
    </>
  );
}

export function RedirectComponent({
  href,
  message,
}: {
  href?: string;
  message?: string;
}) {
  const { theme } = useTheme();
  useEffect(() => {
    if (message) {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: theme,
      });
    }
    redirect(href || "/");
  });
  return <></>;
}
