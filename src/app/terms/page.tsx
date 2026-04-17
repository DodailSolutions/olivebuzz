import type { Metadata } from "next"
import Link from "next/link"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = { title: `Terms of Service | ${APP_NAME}` }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
      </nav>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <h1 className="text-3xl font-black text-stone-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-stone-400 mb-8">Last updated: January 2025</p>
          <div className="prose prose-stone prose-sm max-w-none space-y-6 text-stone-700">
            <section>
              <h2 className="text-lg font-black text-stone-900">1. Acceptance of Terms</h2>
              <p>By accessing or using Olive Buzz, you agree to be bound by these Terms of Service. Schools using the platform agree on behalf of their students and staff.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900">2. Platform Use</h2>
              <p>Olive Buzz is a school journalism and communication platform. Use of the platform is restricted to registered school communities. You may not use the platform for commercial purposes without our written consent.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900">3. Content Standards</h2>
              <p>All content published on Olive Buzz must comply with our Community Guidelines. We reserve the right to remove content that is harmful, misleading, or violates school policies. Student content is subject to school administrator review.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900">4. Privacy & Data</h2>
              <p>We collect and process data as described in our <Link href="/privacy" className="text-[#808b47] font-medium hover:underline">Privacy Policy</Link>. Schools retain ownership of their data. We do not sell student data to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900">5. Intellectual Property</h2>
              <p>Student-authored content remains the intellectual property of the student and their school. Olive Buzz retains rights to the platform software, design, and branding.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900">6. Termination</h2>
              <p>Either party may terminate this agreement with 30 days' notice. Olive Buzz reserves the right to immediately terminate accounts that violate these terms.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900">7. Contact</h2>
              <p>For questions about these terms, contact us at <a href="mailto:legal@olivebuzz.com" className="text-[#808b47] hover:underline">legal@olivebuzz.com</a> or visit our <Link href="/contact" className="text-[#808b47] hover:underline">contact page</Link>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
