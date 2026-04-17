import { NextRequest, NextResponse } from "next/server"

const VALID_LOCALES = ["en", "hi", "te", "ml", "ta"] as const

export function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const locale = searchParams.get("locale") ?? ""
  const rawReturn = searchParams.get("returnTo") ?? "/"

  // Validate locale
  if (!VALID_LOCALES.includes(locale as (typeof VALID_LOCALES)[number])) {
    return NextResponse.redirect(new URL("/", request.url), { status: 302 })
  }

  // Validate returnTo — must be a relative path on the same origin (prevent open redirect)
  let returnPath = "/"
  try {
    const parsed = new URL(rawReturn, origin)
    if (parsed.origin === origin) {
      returnPath = parsed.pathname + parsed.search + parsed.hash
    }
  } catch {
    returnPath = "/"
  }

  const response = NextResponse.redirect(new URL(returnPath, request.url), { status: 302 })
  response.cookies.set("OLIVE_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  })
  return response
}
