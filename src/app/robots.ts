import type { MetadataRoute } from "next"
import { APP_URL } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/for-schools",
          "/subscribe",
          "/advertise",
          "/testimonials",
          "/contact",
          "/safety-quiz",
          "/register",
          "/login",
          "/newspaper",
          "/terms",
          "/privacy",
          "/refund",
        ],
        disallow: [
          "/dashboard/",
          "/super-admin/",
          "/invite/",
          "/onboarding/",
          "/api/",
          "/auth/",
          "/verify-email",
        ],
      },
      {
        // Block AI training crawlers
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "cohere-ai",
          "Bytespider",
          "Applebot-Extended",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  }
}
