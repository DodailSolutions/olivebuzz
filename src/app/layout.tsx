import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { APP_DESCRIPTION, APP_NAME, APP_URL, SITE_KEYWORDS } from "@/lib/constants"
import { MobileNav } from "@/components/mobile-nav"
import "./globals.css"

export const dynamic = "force-dynamic"

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

const ogImage = {
  url: `${APP_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${APP_NAME} — Safe School Social Platform`,
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Safe Social & News Platform for Schools`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  referrer: "strict-origin-when-cross-origin",
  keywords: SITE_KEYWORDS,
  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  category: "Education",
  classification: "Education / Social Platform",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: `${APP_NAME} — Safe Social & News Platform for Schools`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: "website",
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Safe Social & News Platform for Schools`,
    description: APP_DESCRIPTION,
    images: [ogImage.url],
    creator: "@olivebuzz",
    site: "@olivebuzz",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  icons: {
    icon: [
      { url: "/olive-buzz-logo.svg", type: "image/svg+xml" },
      { url: "/olive-buzz-logo.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/olive-buzz-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/olive-buzz-logo.svg",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#808b47" },
    { media: "(prefers-color-scheme: dark)", color: "#57714d" },
  ],
}

// JSON-LD structured data — Organization schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_NAME,
  url: APP_URL,
  logo: `${APP_URL}/olive-buzz-logo.svg`,
  description: APP_DESCRIPTION,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${APP_URL}/contact`,
    availableLanguage: "English",
  },
  offers: {
    "@type": "Offer",
    description: "Safe school community and news platform for students, parents and educators",
    url: `${APP_URL}/for-schools`,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${interSans.variable} ${outfitSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col pb-20 md:pb-0" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <MobileNav />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
