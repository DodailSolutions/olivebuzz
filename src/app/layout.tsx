import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants"
import { MobileNav } from "@/components/mobile-nav"
import "./globals.css"

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  referrer: "strict-origin-when-cross-origin",
  keywords: [
    "education social platform",
    "school community",
    "student news",
    "safe school app",
    "parent communication",
  ],
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  icons: {
    icon: "/olive-buzz-icon.svg",
    apple: "/olive-buzz-icon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#808b47",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${outfitSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col pb-20 md:pb-0" suppressHydrationWarning>
        {children}
        <MobileNav />
      </body>
    </html>
  )
}
