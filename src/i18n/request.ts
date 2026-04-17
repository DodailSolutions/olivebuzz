import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const VALID_LOCALES = ["en", "hi", "te", "ml", "ta"] as const
type Locale = (typeof VALID_LOCALES)[number]

// Static import map so Turbopack/webpack can statically analyze each file
const messageLoaders: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("../../messages/en.json"),
  hi: () => import("../../messages/hi.json"),
  te: () => import("../../messages/te.json"),
  ml: () => import("../../messages/ml.json"),
  ta: () => import("../../messages/ta.json"),
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const raw = cookieStore.get("OLIVE_LOCALE")?.value ?? "en"
  const locale: Locale = VALID_LOCALES.includes(raw as Locale) ? (raw as Locale) : "en"

  const messages = (await messageLoaders[locale]()).default

  return {
    locale,
    messages,
  }
})
