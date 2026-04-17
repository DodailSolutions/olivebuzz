import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Newspaper, Shield, Users, Zap, BookOpen, BarChart3 } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `For Schools | ${APP_NAME}`,
  description: "Everything your school needs for digital journalism, safe communication, and community building.",
}

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <div className="flex gap-3">
          <Link href="/testimonials" className="hidden sm:block text-sm font-medium text-stone-600 hover:text-stone-900">Stories</Link>
          <Link href="/onboarding/school" className="rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="relative py-24 text-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #808b47 0%, #57714d 100%)" }}
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
        <div className="relative mx-auto max-w-4xl px-4 text-white">
          <Newspaper className="h-16 w-16 mx-auto mb-5 opacity-80" />
          <h1 className="text-5xl font-black leading-tight">
            Your school deserves a<br />digital newsroom
          </h1>
          <p className="mt-5 text-xl text-white/80 max-w-2xl mx-auto">
            Olive Buzz gives every school — from primary to university — a safe, beautiful, fully moderated platform for journalism, social learning, and community.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding/school"
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#808b47] hover:bg-stone-100"
            >
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/60">No credit card required. Up and running in under 10 minutes.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
        {/* Core Features */}
        <section>
          <h2 className="text-3xl font-black text-stone-900 mb-2 text-center">Everything in one platform</h2>
          <p className="text-stone-600 text-center mb-10">Built specifically for the unique needs of school communities</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Newspaper,
                title: "Digital Newspaper CMS",
                desc: "Student journalists pitch, write, edit, and publish articles with full editorial review and SEO optimization.",
                color: "#808b47",
              },
              {
                icon: Shield,
                title: "AI Safety Moderation",
                desc: "Every post, comment, and article is scanned for bullying, misinformation, and inappropriate content.",
                color: "#e14851",
              },
              {
                icon: Users,
                title: "School Social Feed",
                desc: "A safe alternative to social media — school-only, grade-filtered, teacher-moderated.",
                color: "#57714d",
              },
              {
                icon: Zap,
                title: "Age-Adaptive UI",
                desc: "KG-5 gets big buttons and simple text. High schoolers get the full journalism suite.",
                color: "#c4891a",
              },
              {
                icon: BookOpen,
                title: "Assignment Integration",
                desc: "Teachers set writing assignments. Students submit directly. Grades built in.",
                color: "#6366f1",
              },
              {
                icon: BarChart3,
                title: "School Analytics",
                desc: "Track engagement, readership, top contributors, and safety metrics on one dashboard.",
                color: "#0891b2",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-stone-200 bg-white p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl mb-3"
                  style={{ backgroundColor: `${f.color}18` }}
                >
                  <f.icon className="h-5.5 w-5.5" style={{ color: f.color }} />
                </div>
                <p className="font-black text-stone-900">{f.title}</p>
                <p className="mt-2 text-xs text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Setup Steps */}
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-black text-stone-900 mb-5">Set up in minutes</h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "Register your school", desc: "Basic school details, admin email, and school code." },
                { step: "02", title: "Invite your team", desc: "Teachers, editors, and parents get a magic link." },
                { step: "03", title: "Customize & go live", desc: "Add your school logo, colors, and first newspaper edition." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 rounded-2xl bg-white border border-stone-200 p-4">
                  <span className="text-2xl font-black text-[#808b47]">{s.step}</span>
                  <div>
                    <p className="font-bold text-stone-900">{s.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#808b47]/10 border border-[#808b47]/20 p-8">
            <p className="text-lg font-black text-stone-900 mb-4">What&apos;s included for free:</p>
            <ul className="space-y-2.5">
              {[
                "Full school newspaper CMS",
                "School social feed",
                "3 editorial staff seats",
                "AI content moderation",
                "Parent + student portals",
                "Safety quiz & reporting tools",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-stone-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#808b47]" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/onboarding/school"
              className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-[#808b47] py-3.5 text-sm font-bold text-white hover:bg-[#57714d]"
            >
              Start Free Today <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <Link
          href="/testimonials"
          className="block rounded-2xl border border-stone-200 bg-white p-6 text-center hover:shadow-md transition"
        >
          <p className="text-sm text-stone-500">Trusted by school leaders across India</p>
          <p className="mt-1 font-black text-[#808b47]">Read their stories →</p>
        </Link>
      </div>
    </div>
  )
}
