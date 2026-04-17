import type { Metadata } from "next"
import Link from "next/link"
import { Star, ArrowRight, Quote } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Testimonials | ${APP_NAME}`,
}

const TESTIMONIALS = [
  {
    quote: "Olive Buzz transformed how our students engage with news. The editorial tools are professional yet simple enough for Grade 6 students to use.",
    name: "Ananya Krishnamurthy",
    role: "Principal",
    school: "DPS, Bangalore",
    avatar: "AK",
    color: "#808b47",
    stars: 5,
  },
  {
    quote: "As a teacher-advisor, I used to spend hours reviewing content. Now the AI moderation catches issues before they reach me, and I can focus on mentoring.",
    name: "Rahul Bose",
    role: "English Teacher & Newspaper Advisor",
    school: "Kendriya Vidyalaya, Pune",
    avatar: "RB",
    color: "#57714d",
    stars: 5,
  },
  {
    quote: "My daughter used to dread writing. Since Olive Buzz, she's written 14 articles and won a state-level journalism award. I can see exactly what she publishes.",
    name: "Preeti Mehta",
    role: "Parent",
    school: "Springdales School, Delhi",
    avatar: "PM",
    color: "#c4891a",
    stars: 5,
  },
  {
    quote: "We moved from WhatsApp groups to Olive Buzz for school communication. The moderation and structure are night and day.",
    name: "Dr. Sriram Venkatesh",
    role: "School Admin",
    school: "Amrita Vidyalayam, Chennai",
    avatar: "SV",
    color: "#e14851",
    stars: 5,
  },
  {
    quote: "I love the safety quiz! It helps me know if something feels wrong and who to tell. My teacher says it's important.",
    name: "Riya, Class 5",
    role: "Student",
    school: "St. Mary's School, Mumbai",
    avatar: "R",
    color: "#808b47",
    stars: 5,
  },
  {
    quote: "The onboarding was seamless. We had students posting to the feed and submitting articles on day one. Setup took less than 20 minutes.",
    name: "Meena Subramaniam",
    role: "IT Coordinator",
    school: "Bishop Cotton Girls' School",
    avatar: "MS",
    color: "#57714d",
    stars: 5,
  },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <Link href="/onboarding/school" className="rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]">
          Get Started Free
        </Link>
      </nav>

      {/* Hero */}
      <div className="py-16 text-center bg-white border-b border-stone-200">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-[#f2b239] text-[#f2b239]" />
            ))}
          </div>
          <h1 className="text-4xl font-black text-stone-900">Loved by school communities</h1>
          <p className="mt-4 text-stone-600">
            From KG teachers to university principals — here&apos;s what educators and families are saying.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14">
        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-stone-200 bg-white p-6 flex flex-col"
            >
              <Quote className="h-6 w-6 text-stone-200 mb-3" />
              <p className="flex-1 text-sm text-stone-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-stone-100">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-black text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.role} · {t.school}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mt-3">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-[#f2b239] text-[#f2b239]" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-14 rounded-3xl p-10 text-center text-white"
          style={{ background: "linear-gradient(135deg, #808b47, #57714d)" }}
        >
          <p className="text-3xl font-black">Ready to join them?</p>
          <p className="mt-3 text-white/80">Get your school on Olive Buzz for free — no credit card, no commitment.</p>
          <Link
            href="/onboarding/school"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#808b47] hover:bg-stone-100"
          >
            Start Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
