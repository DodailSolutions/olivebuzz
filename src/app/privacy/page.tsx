import type { Metadata } from "next"
import Link from "next/link"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = { title: `Privacy Policy | ${APP_NAME}` }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
      </nav>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <h1 className="text-3xl font-black text-stone-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-stone-400 mb-8">Last updated: January 2025</p>
          <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">What We Collect</h2>
              <p>We collect information you provide (name, email, school affiliation), content you create (posts, articles, comments), and usage data (login times, pages visited). We do not collect sensitive personal information beyond what is needed to operate the platform.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">How We Use It</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>To provide and improve the platform</li>
                <li>To moderate content for safety</li>
                <li>To send school-related notifications (with school admin approval)</li>
                <li>To generate anonymized analytics for schools</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Student Data (COPPA & FERPA)</h2>
              <p>We take student privacy seriously. We comply with COPPA for users under 13 and FERPA for educational records. Student data is never sold, shared with advertisers, or used for profiling. Schools control all student data and can request deletion at any time.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Data Sharing</h2>
              <p>We do not sell your data. We may share data with trusted service providers (e.g., cloud hosting, email delivery) who are contractually bound to protect it. We may disclose data if required by law or to protect safety.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Data Retention & Deletion</h2>
              <p>Schools can export or delete their data at any time from the admin dashboard. We retain anonymized analytics for up to 3 years. Student accounts are automatically deactivated when they leave the school unless transferred.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Contact</h2>
              <p>For privacy concerns, email <a href="mailto:privacy@olivebuzz.com" className="text-[#808b47] hover:underline">privacy@olivebuzz.com</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
