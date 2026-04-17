import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield, Newspaper, Users } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Subscribe | ${APP_NAME}`,
  description: "Get the best of Olive Buzz delivered to your school community.",
}

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    color: "bg-stone-50 border-stone-200",
    btn: "bg-stone-900 text-white",
    features: ["School newspaper access", "3 editorial seats", "Basic feed", "AI moderation"],
    cta: "Get Started Free",
    href: "/onboarding/school",
    popular: false,
  },
  {
    name: "Starter",
    price: "₹499",
    period: "per month",
    color: "bg-white border-[#808b47]/40 shadow-lg",
    btn: "bg-[#808b47] text-white",
    features: [
      "Everything in Free",
      "CMS + editorial workflow",
      "10 editorial seats",
      "Email digest",
      "Parent notifications",
    ],
    cta: "Start Free Trial",
    href: "/onboarding/school",
    popular: true,
  },
  {
    name: "Pro",
    price: "₹1,499",
    period: "per month",
    color: "bg-white border-stone-200",
    btn: "bg-stone-900 text-white",
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Custom domain",
      "AI writing assistant",
      "Unlimited editors",
    ],
    cta: "Go Pro",
    href: "/onboarding/school",
    popular: false,
  },
]

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <Link href="/login" className="rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]">
          Log In
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#808b47]/15 px-3 py-1 text-xs font-bold text-[#57714d] mb-4">
            <Newspaper className="h-3.5 w-3.5" /> Plans & Pricing
          </span>
          <h1 className="text-5xl font-black text-stone-900">Give your school a voice</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-xl mx-auto">
            Olive Buzz brings safe, moderated, beautiful digital publishing to every school.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-7 ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#808b47] px-4 py-1 text-xs font-black text-white">
                  Most Popular
                </div>
              )}
              <p className="text-sm font-bold text-stone-500 uppercase tracking-wider">{plan.name}</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-black text-stone-900">{plan.price}</span>
                <span className="mb-1 text-sm text-stone-400">/{plan.period}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-stone-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#808b47]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-7 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${plan.btn} hover:opacity-90`}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3 text-center">
          {[
            { icon: Shield, label: "FERPA & COPPA compliant", desc: "Built with student safety first" },
            { icon: Users, label: "School-controlled data", desc: "Your data stays with your school" },
            { icon: Newspaper, label: "Student-powered journalism", desc: "Real skills for real careers" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-6">
              <item.icon className="h-7 w-7 text-[#808b47] mx-auto mb-3" />
              <p className="font-bold text-stone-900">{item.label}</p>
              <p className="mt-1 text-xs text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#808b47] hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}
