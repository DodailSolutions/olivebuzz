import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Newspaper } from "lucide-react"
import { login } from "@/app/actions/auth"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Sign In | Olive Buzz",
  description: "Sign in to your Olive Buzz school account.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  // Redirect already-logged-in users
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect("/dashboard")

  const params = await searchParams
  const errorMsg = params.error

  return (
    <div className="flex min-h-screen bg-[#f5f0e8]">
      {/* ── Left decorative panel ───────────────────────────── */}
      <div
        className="hidden w-[45%] flex-col justify-between p-12 lg:flex"
        style={{ background: "linear-gradient(160deg, #808b47 0%, #57714d 55%, #3a5038 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="overflow-hidden rounded-2xl bg-white/20 p-1 backdrop-blur-sm">
            <Image src="/olive-buzz-logo.svg" alt="Olive Buzz" width={40} height={40} priority />
          </div>
          <span className="text-lg font-black text-white tracking-tight">Olive Buzz</span>
        </Link>

        <div className="space-y-6">
          <blockquote className="space-y-3">
            <p className="text-3xl font-black leading-tight text-white">
              "A safer digital campus for every school community."
            </p>
            <p className="text-white/70 text-sm">
              Students, teachers, and parents — all connected in a safe, private space built for education.
            </p>
          </blockquote>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "500+", label: "Schools" },
              { value: "2M+", label: "Students" },
              { value: "99.9%", label: "Uptime" },
              { value: "100%", label: "Safe" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/60 text-xs">
          <Newspaper className="h-4 w-4" />
          <span>Safe · Private · School-first</span>
        </div>
      </div>

      {/* ── Right: login form ───────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <Image src="/olive-buzz-logo.svg" alt="Olive Buzz" width={36} height={36} />
          <span className="font-black text-stone-900">Olive Buzz</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-stone-900">Welcome back</h1>
            <p className="mt-2 text-stone-500">Sign in to your school account.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(errorMsg)}
            </div>
          )}

          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-1.5">
                School email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@school.edu"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-[#808b47] focus:ring-2 focus:ring-[#808b47]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-stone-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#808b47] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-[#808b47] focus:ring-2 focus:ring-[#808b47]/20"
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#808b47] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#808b47]/25 transition-all hover:bg-[#57714d] hover:-translate-y-0.5"
            >
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-900 mb-1">New to Olive Buzz?</p>
            <p className="text-xs text-stone-500 mb-3">
              Get your school set up with a safe, private campus platform.
            </p>
            <Link
              href="/onboarding/school"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#808b47] hover:underline"
            >
              Request school access <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-stone-400">
            By signing in you agree to our{" "}
            <Link href="/terms" className="underline hover:text-stone-600">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-stone-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
