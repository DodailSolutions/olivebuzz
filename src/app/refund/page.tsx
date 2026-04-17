import type { Metadata } from "next"
import Link from "next/link"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = { title: `Refund Policy | ${APP_NAME}` }

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
      </nav>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <h1 className="text-3xl font-black text-stone-900 mb-2">Refund Policy</h1>
          <p className="text-sm text-stone-400 mb-8">Last updated: January 2025</p>
          <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Free Plan</h2>
              <p>The Free plan has no charges and therefore no refunds applicable. You may cancel or downgrade at any time.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Paid Plans</h2>
              <p>Paid subscriptions (Starter, Pro) are billed monthly or annually. We offer a 14-day money-back guarantee from the date of your first payment. After 14 days, refunds are not available for the current billing period.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Annual Subscriptions</h2>
              <p>Annual plans may be refunded on a pro-rated basis within the first 30 days. After 30 days, no refunds are issued for the remaining period, though your account remains active until the end of the term.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">Cancellation</h2>
              <p>You may cancel your subscription at any time from your admin dashboard. Your access continues until the end of the current billing period. No partial refunds for unused time unless covered by the 14-day guarantee.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-stone-900 mb-2">How to Request a Refund</h2>
              <p>Email <a href="mailto:billing@olivebuzz.com" className="text-[#808b47] hover:underline">billing@olivebuzz.com</a> with your school name, account email, and reason for the refund. We process requests within 5 business days.</p>
            </section>
          </div>
          <div className="mt-8 rounded-2xl bg-[#808b47]/10 border border-[#808b47]/20 p-5">
            <p className="text-sm font-bold text-[#57714d]">Questions? <Link href="/contact" className="underline">Contact our team</Link> — we&apos;re happy to help.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
