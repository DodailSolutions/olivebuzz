import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowRight, BarChart3, Users, Globe } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Advertise | ${APP_NAME}`,
}

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <Link href="/contact" className="rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]">Get In Touch</Link>
      </nav>

      {/* Hero */}
      <div className="bg-white border-b border-stone-200 py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full bg-[#f2b239]/20 px-3 py-1 text-xs font-black text-[#c4891a] mb-4">
            ADVERTISE WITH US
          </span>
          <h1 className="text-5xl font-black text-stone-900">Reach students, parents & educators</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            Olive Buzz is India&apos;s leading school journalism platform. Connect your brand with the next generation in a trusted, safe environment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="flex items-center gap-2 rounded-2xl bg-[#808b47] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#57714d]">
              Request a Media Kit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
        {/* Audience */}
        <section>
          <h2 className="text-3xl font-black text-stone-900 mb-2">Our audience</h2>
          <p className="text-stone-600 mb-8">Highly engaged school communities across India</p>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: Users, num: "50K+", label: "Monthly Active Users", sub: "students, teachers & parents" },
              { icon: Globe, num: "200+", label: "Schools", sub: "across 15 cities" },
              { icon: BarChart3, num: "85%", label: "Open Rate", sub: "for school digest emails" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
                <s.icon className="h-8 w-8 text-[#808b47] mx-auto mb-3" />
                <p className="text-4xl font-black text-stone-900">{s.num}</p>
                <p className="mt-1 font-bold text-stone-700">{s.label}</p>
                <p className="mt-0.5 text-xs text-stone-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section>
          <h2 className="text-3xl font-black text-stone-900 mb-8">Advertising packages</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "School Spotlight",
                price: "₹4,999/mo",
                desc: "Perfect for edtech brands and local businesses.",
                features: ["Banner ad in school newspaper", "1 sponsored article", "Email footer placement", "Monthly analytics report"],
                cta: "Get Started",
                accent: "border-stone-200",
                btnClass: "bg-stone-900 text-white",
              },
              {
                name: "District Reach",
                price: "₹14,999/mo",
                desc: "Reach students and families across multiple schools.",
                features: ["All School Spotlight features", "Multi-school targeting", "5 sponsored articles", "In-app push notification", "Weekly analytics"],
                cta: "Most Popular",
                accent: "border-[#808b47]/50 shadow-lg ring-1 ring-[#808b47]/20",
                btnClass: "bg-[#808b47] text-white",
              },
              {
                name: "National Network",
                price: "Custom",
                desc: "Large-scale campaigns for national brands.",
                features: ["Platform-wide reach", "Custom branded content", "Video & interactive ads", "Dedicated account manager", "Real-time dashboard"],
                cta: "Contact Us",
                accent: "border-stone-200",
                btnClass: "bg-stone-900 text-white",
              },
            ].map((p) => (
              <div key={p.name} className={`rounded-3xl border bg-white p-7 ${p.accent}`}>
                <p className="font-black text-stone-900">{p.name}</p>
                <p className="mt-1 text-2xl font-black text-[#808b47]">{p.price}</p>
                <p className="mt-2 text-xs text-stone-500">{p.desc}</p>
                <ul className="mt-5 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-stone-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#808b47]" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-7 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${p.btnClass} hover:opacity-90`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Note */}
        <div className="rounded-2xl bg-[#808b47]/10 border border-[#808b47]/20 p-6 text-center">
          <p className="text-sm font-bold text-[#57714d]">
            All advertising on Olive Buzz is age-appropriate, school-approved, and reviewed for safety.
            We do not run gambling, alcohol, tobacco, or adult content ads.
          </p>
        </div>
      </div>
    </div>
  )
}
