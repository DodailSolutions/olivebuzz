import type { Metadata } from "next"
import { Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Verify Your Email | ${APP_NAME}`,
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-[#808b47]">{APP_NAME}</Link>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#808b47]/10 mb-6">
            <Mail className="h-10 w-10 text-[#808b47]" />
          </div>

          <h1 className="text-2xl font-black text-stone-900">Check your inbox!</h1>
          <p className="mt-3 text-stone-600 text-sm leading-relaxed">
            We&apos;ve sent a verification link to your email address. Click the link in the email to activate your account.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Check your spam/junk folder if you don't see it",
              "The link expires in 24 hours",
              "Make sure you used the right email address",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2.5 rounded-xl bg-stone-50 px-4 py-3 text-left">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#808b47] mt-0.5" />
                <p className="text-xs text-stone-600">{tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-stone-100 pt-6 space-y-3">
            <p className="text-xs text-stone-500">Didn&apos;t receive the email?</p>
            <Link
              href="/login"
              className="block rounded-2xl bg-[#808b47] py-3 text-sm font-bold text-white hover:bg-[#57714d]"
            >
              Back to Login
            </Link>
            <Link
              href="/contact"
              className="block rounded-2xl border border-stone-200 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
