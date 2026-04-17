"use server"

import { cookies } from "next/headers"

const VALID_LOCALES = ["en", "hi", "te", "ml", "ta"] as const

export async function setLocale(locale: string) {
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) return

  const cookieStore = await cookies()
  cookieStore.set("OLIVE_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}
