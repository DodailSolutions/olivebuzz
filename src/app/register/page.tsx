"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

type Role = "student" | "parent" | "teacher"

const ROLES: { value: Role; label: string; desc: string; emoji: string }[] = [
  { value: "student", label: "Student", desc: "Join your school community", emoji: "🎓" },
  { value: "parent", label: "Parent / Guardian", desc: "Follow your child's school", emoji: "👨‍👩‍👧" },
  { value: "teacher", label: "Teacher", desc: "Engage with your class", emoji: "👩‍🏫" },
]

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("student")
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const form = e.currentTarget
    const data = new FormData(form)

    const pwd = data.get("password") as string
    const pwd2 = data.get("confirm_password") as string
    if (pwd !== pwd2) {
      setError("Passwords do not match.")
      return
    }
    if (pwd.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    const schoolCode = (data.get("school_code") as string).trim()
    if (!schoolCode) {
      setError("Please enter your school code. Ask your teacher or admin for it.")
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.get("email"),
            password: pwd,
            display_name: data.get("display_name"),
            role,
            school_code: schoolCode,
          }),
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.error ?? "Registration failed. Please try again.")
        } else {
          window.location.href = "/verify-email"
        }
      } catch {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-black text-[#808b47]">{APP_NAME}</Link>
          <p className="mt-2 text-sm text-stone-500">Create your account</p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
          {step === 1 ? (
            <div>
              <h1 className="text-xl font-black text-stone-900 mb-1">Who are you?</h1>
              <p className="text-sm text-stone-500 mb-6">Choose your role to get started</p>

              <div className="space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                      role === r.value
                        ? "border-[#808b47] bg-[#808b47]/8"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <p className="font-black text-stone-900">{r.label}</p>
                      <p className="text-xs text-stone-500">{r.desc}</p>
                    </div>
                    <div className={`ml-auto h-5 w-5 rounded-full border-2 ${role === r.value ? "border-[#808b47] bg-[#808b47]" : "border-stone-300"}`}>
                      {role === r.value && (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#808b47] py-3.5 text-sm font-bold text-white hover:bg-[#57714d]"
              >
                Continue as {ROLES.find((r) => r.value === role)?.label} <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-4 text-center text-xs text-stone-400">
                Have an invitation?{" "}
                <Link href="/invite" className="font-bold text-[#808b47] hover:underline">Use invite link</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-5 text-xs font-bold text-stone-400 hover:text-stone-700 flex items-center gap-1"
              >
                ← Back
              </button>
              <h1 className="text-xl font-black text-stone-900 mb-1">
                {role === "student" ? "Student" : role === "parent" ? "Parent / Guardian" : "Teacher"} Registration
              </h1>
              <p className="text-sm text-stone-500 mb-6">Fill in your details to join your school</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Full Name</label>
                  <input
                    name="display_name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                  />
                  {role === "student" && (
                    <p className="mt-1 text-xs text-stone-400">Use your school email if you have one</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">School Code</label>
                  <input
                    name="school_code"
                    type="text"
                    required
                    placeholder="e.g. DPS-BLR-2024"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-mono outline-none focus:border-[#808b47] focus:bg-white uppercase"
                  />
                  <p className="mt-1 text-xs text-stone-400">
                    Ask your school admin or teacher for this code
                  </p>
                </div>

                {role === "student" && (
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Grade / Year</label>
                    <select
                      name="grade"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                    >
                      <option value="">Select your grade</option>
                      {["KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((g) => (
                        <option key={g} value={g}>Grade {g}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-10 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Confirm Password</label>
                  <input
                    name="confirm_password"
                    type="password"
                    required
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#808b47] py-3.5 text-sm font-bold text-white hover:bg-[#57714d] disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {isPending ? "Creating account…" : "Create Account"}
              </button>

              <p className="mt-3 text-center text-xs text-stone-400">
                By registering, you agree to our{" "}
                <Link href="/terms" className="text-[#808b47] hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-[#808b47] hover:underline">Privacy Policy</Link>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#808b47] hover:underline">Log In</Link>
        </p>

        <p className="text-center text-xs text-stone-400">
          Are you a school?{" "}
          <Link href="/onboarding/school" className="font-bold text-[#808b47] hover:underline">Register your school →</Link>
        </p>
      </div>
    </div>
  )
}
