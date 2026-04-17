import type { Metadata } from "next"
import Link from "next/link"
import { Newspaper, Shield, Zap, Heart, ArrowRight } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `About Us | ${APP_NAME}`,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <div className="flex gap-3">
          <Link href="/newspaper" className="text-sm font-medium text-stone-600 hover:text-stone-900">Read</Link>
          <Link href="/login" className="rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]">Log In</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#808b47] text-white py-24 text-center">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,.3) 30px, rgba(255,255,255,.3) 31px)"
        }} />
        <div className="relative mx-auto max-w-3xl px-4">
          <Newspaper className="h-14 w-14 mx-auto mb-5 opacity-80" />
          <h1 className="text-5xl font-black leading-tight">
            We believe every student<br />deserves a platform.
          </h1>
          <p className="mt-5 text-xl text-white/80">
            Olive Buzz is building the world&apos;s safest, most powerful school journalism platform — one community at a time.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-16">
        {/* Mission */}
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-black text-[#808b47] uppercase tracking-widest">Our Mission</span>
            <h2 className="mt-2 text-3xl font-black text-stone-900">Empowering young voices</h2>
            <p className="mt-4 text-stone-600 leading-relaxed">
              School newspapers have always been where future journalists, storytellers, and community leaders learn their craft.
              We bring that tradition into the digital age — with safety, creativity, and real-world skills at the core.
            </p>
            <p className="mt-3 text-stone-600 leading-relaxed">
              From KG to postgrad, Olive Buzz adapts to every age tier: simple big-button interfaces for little learners, full editorial tools for senior students.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "200+", label: "Schools onboarded" },
              { num: "50K+", label: "Student journalists" },
              { num: "2M+", label: "Articles published" },
              { num: "15", label: "Indian cities" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-5 text-center">
                <p className="text-3xl font-black text-[#808b47]">{s.num}</p>
                <p className="mt-1 text-xs text-stone-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-black text-stone-900 mb-6">What we stand for</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Safety First", desc: "FERPA & COPPA compliant. AI-powered content moderation. Every post reviewed.", color: "#808b47" },
              { icon: Zap, title: "Real Skills", desc: "Students learn journalism, editing, SEO, and digital storytelling.", color: "#c4891a" },
              { icon: Newspaper, title: "School-Owned", desc: "Your school's data stays yours. No advertising. No tracking.", color: "#57714d" },
              { icon: Heart, title: "Community", desc: "Built on connection — between students, teachers, and families.", color: "#e14851" },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-stone-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl mb-3" style={{ backgroundColor: `${v.color}18` }}>
                  <v.icon className="h-5.5 w-5.5" style={{ color: v.color }} />
                </div>
                <p className="font-black text-stone-900">{v.title}</p>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-3xl font-black text-stone-900 mb-6">The team behind the buzz</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { name: "Priya Sharma", role: "Founder & CEO", emoji: "👩‍💻" },
              { name: "Arjun Mehta", role: "Head of Product", emoji: "🎯" },
              { name: "Kavya Nair", role: "Head of Safety", emoji: "🛡️" },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
                <div className="text-4xl mb-3">{t.emoji}</div>
                <p className="font-black text-stone-900">{t.name}</p>
                <p className="mt-0.5 text-xs text-stone-500">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[#808b47] p-10 text-center text-white">
          <h2 className="text-3xl font-black">Join the movement</h2>
          <p className="mt-3 text-white/80">Bring Olive Buzz to your school and watch your students thrive.</p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding/school"
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#808b47] hover:bg-stone-100"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
