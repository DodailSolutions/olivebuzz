import type { MetadataRoute } from "next"
import { APP_URL } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static marketing & public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${APP_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${APP_URL}/for-schools`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${APP_URL}/subscribe`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${APP_URL}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${APP_URL}/safety-quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${APP_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${APP_URL}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${APP_URL}/newspaper`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${APP_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]

  return staticRoutes
}
