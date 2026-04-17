import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Contact Us | ${APP_NAME}`,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <Link href="/login" className="rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]">Log In</Link>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-stone-900">Say Hello</h1>
          <p className="mt-3 text-lg text-stone-600">We&apos;d love to hear from you — questions, feedback, or just to connect.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact Form */}
          <div className="lg:col-span-3 rounded-3xl border border-stone-200 bg-white p-8">
            <h2 className="text-xl font-black text-stone-900 mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@school.org"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Subject</label>
                <select className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white">
                  <option>General Inquiry</option>
                  <option>School Onboarding</option>
                  <option>Technical Support</option>
                  <option>Billing & Plans</option>
                  <option>Partnership</option>
                  <option>Report an Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us how we can help…"
                  className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#808b47] py-3.5 text-sm font-bold text-white hover:bg-[#57714d]"
              >
                Send Message
              </button>
              <p className="text-center text-xs text-stone-400">We typically respond within 1 business day.</p>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "hello@olivebuzz.com",
                desc: "For general questions & partnerships",
                color: "#808b47",
              },
              {
                icon: MessageSquare,
                label: "Support",
                value: "support@olivebuzz.com",
                desc: "Technical help & account issues",
                color: "#c4891a",
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+91 98765 43210",
                desc: "Mon–Fri, 9 AM – 6 PM IST",
                color: "#57714d",
              },
              {
                icon: MapPin,
                label: "Office",
                value: "Bangalore, India",
                desc: "Remote-first team",
                color: "#e14851",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${item.color}18` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-stone-900">{item.value}</p>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}

            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: "linear-gradient(135deg, #808b47, #57714d)" }}
            >
              <p className="font-black">Looking to bring Olive Buzz to your school?</p>
              <p className="mt-1 text-sm text-white/80">
                Schedule a free demo with our team and see how we transform school communication.
              </p>
              <Link
                href="/for-schools"
                className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#808b47] hover:bg-stone-100"
              >
                Book a Demo →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
