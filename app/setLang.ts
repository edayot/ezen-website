"use server";

import { cookies } from "next/headers";

export async function setLocaleCookie(locale: string) {
  cookies().set({
    name: "NEXT_LOCALE",
    value: locale,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
