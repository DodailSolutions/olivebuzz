"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, ChevronRight, Newspaper, ShieldAlert, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TutorialOverlayProps {
  userId: string
  hasCompleted: boolean
}

export function TutorialOverlay({ userId, hasCompleted }: TutorialOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    // Show only if not explicitly completed in the DB payload
    if (!hasCompleted) {
      // Slight delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [hasCompleted])

  if (!isVisible) return null

  const steps = [
    {
      title: "Welcome to Olive Buzz!",
      description: "We are thrilled to have you join our secure school community. Let's take a quick look around your new digital campus.",
      icon: <Users className="h-10 w-10 text-[#808b47]" />,
      color: "bg-[#808b47]",
    },
    {
      title: "The Digital Newspaper",
      description: "Read the latest updates, event reports, and stories written securely by students and staff.",
      icon: <Newspaper className="h-10 w-10 text-[#c4891a]" />,
      color: "bg-[#c4891a]",
    },
    {
      title: "Safe & Secure",
      description: "Every interaction is moderated by AI and School Admins to ensure a positive, bully-free environment.",
      icon: <ShieldAlert className="h-10 w-10 text-[#e14851]" />,
      color: "bg-[#e14851]",
    }
  ]

  async function handleFinish() {
    setIsVisible(false)
    // Mark as completed in the database securely via client
    await supabase
      .from("profiles")
      .update({ has_completed_tutorial: true })
      .eq("id", userId)
  }

  const stepDetails = steps[currentStep]

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-500">
        
        {/* Dynamic Header Background */}
        <div className={`h-32 w-full transition-colors duration-500 ${stepDetails.color} flex items-center justify-center text-white/20`}>
           <div className="absolute top-8 h-20 w-20 rounded-full bg-white/20 blur-xl" />
        </div>

        <div className="relative -mt-12 px-8 pb-8 text-center">
          {/* Icon Badge */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl">
            {stepDetails.icon}
          </div>

          <h2 className="mt-6 font-serif text-2xl font-black text-stone-900">
            {stepDetails.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {stepDetails.description}
          </p>

          {/* Stepper Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-stone-900' : 'w-2.5 bg-stone-200'}`} 
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-4">
            {currentStep < steps.length - 1 ? (
              <>
                <button 
                  onClick={handleFinish}
                  className="flex-1 text-sm font-bold text-stone-400 hover:text-stone-600"
                >
                  Skip Tutorial
                </button>
                <button 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white hover:bg-stone-800 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleFinish}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#808b47] px-4 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="h-5 w-5" />
                Enter Campus
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
