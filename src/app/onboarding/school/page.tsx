"use client"

import { useState } from "react"
import { registerSchoolAndAdmin } from "@/app/actions/school"
import { Building2, School, ShieldCheck } from "lucide-react"

export default function SchoolOnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await registerSchoolAndAdmin(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl p-8 border border-stone-200">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#808b47]/10 text-[#808b47] mb-4">
            <School className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black font-serif text-stone-900">Configure Your Campus</h1>
          <p className="mt-2 text-stone-500">Step {step} of 2</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className={`${step === 1 ? 'block' : 'hidden'} space-y-5 animate-in slide-in-from-right-4 fade-in`}>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">School Name</label>
              <input 
                name="school_name"
                required 
                placeholder="e.g. Greenwood Academy"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] focus:ring-1 focus:ring-[#808b47] outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="theme_primary"
                  defaultValue="#808b47"
                  className="h-12 w-12 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm text-stone-500">Used for navigation and primary buttons</span>
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3.5 text-center text-sm font-bold text-white hover:bg-stone-800 transition-colors"
            >
              Continue to Admin Details
            </button>
          </div>

          <div className={`${step === 2 ? 'block' : 'hidden'} space-y-5 animate-in slide-in-from-right-4 fade-in`}>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Your Full Name</label>
              <input 
                name="display_name"
                required={step === 2}
                placeholder="Principal Smith"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] focus:ring-1 focus:ring-[#808b47] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Admin Email</label>
              <input 
                name="email"
                type="email"
                required={step === 2}
                placeholder="admin@school.org"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] focus:ring-1 focus:ring-[#808b47] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Secure Password</label>
              <input 
                name="password"
                type="password"
                required={step === 2}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] focus:ring-1 focus:ring-[#808b47] outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-1/3 rounded-xl border border-stone-300 px-4 py-3 text-center text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#808b47] px-4 py-3 text-center text-sm font-bold text-white hover:opacity-90 transition-opacity"
              >
                <Building2 className="h-4 w-4" />
                Launch School Platform
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
