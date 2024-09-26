"use client";

import { useTheme } from "next-themes";
import { permanentRedirect } from "next/navigation";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

export default function NotFoundPage() {
  const { theme } = useTheme();
  useEffect(() => {
    toast.error("Error: 404 Not found", {
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
    permanentRedirect("/");
  });

  return <></>;
}
