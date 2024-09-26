"use client";

import { useTheme } from "next-themes";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

export function NotFound({ id }: { id?: string }) {
  const { theme } = useTheme();
  useEffect(() => {
    toast.error(`Error: Article ${id} not found`, {
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
    redirect("/articles");
  });

  return <></>;
}
