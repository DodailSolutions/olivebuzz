"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import type { Profile } from "@/types"

interface AgeGateContextType {
  ageTier: Profile["age_tier"] | null
  role: Profile["role"] | null
  isLoading: boolean
  isKg5: boolean
}

const AgeGateContext = createContext<AgeGateContextType>({
  ageTier: null,
  role: null,
  isLoading: true,
  isKg5: false,
})

export function AgeGateProvider({ 
  children, 
  initialProfile 
}: { 
  children: ReactNode
  initialProfile?: Profile 
}) {
  const profile = initialProfile || null
  const isLoading = false

  const ageTier = profile?.age_tier || null
  const role = profile?.role || null
  const isKg5 = ageTier === "kg_5"

  useEffect(() => {
    // Dynamically inject CSS variables overriding sizing for younger students
    if (isKg5) {
      document.documentElement.style.setProperty('--age-font-scale', '1.15')
      document.documentElement.style.setProperty('--age-spacing-scale', '1.2')
      document.documentElement.classList.add('theme-kid-friendly')
    } else {
      document.documentElement.style.setProperty('--age-font-scale', '1')
      document.documentElement.style.setProperty('--age-spacing-scale', '1')
      document.documentElement.classList.remove('theme-kid-friendly')
    }
  }, [isKg5])

  return (
    <AgeGateContext.Provider value={{ ageTier, role, isLoading, isKg5 }}>
      {children}
    </AgeGateContext.Provider>
  )
}

export function useAgeGate() {
  return useContext(AgeGateContext)
}
