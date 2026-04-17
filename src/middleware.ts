import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const VALID_LOCALES = ["en", "hi", "te", "ml", "ta"]

export function middleware(request: NextRequest) {
  const raw = request.cookies.get("OLIVE_LOCALE")?.value ?? "en"
  const locale = VALID_LOCALES.includes(raw) ? raw : "en"

  // Inject locale as a request header so server components can read it reliably
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", locale)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
