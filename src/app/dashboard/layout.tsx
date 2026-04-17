import type { CSSProperties, ReactNode } from "react"
import { redirect } from "next/navigation"
import { getDashboardContext } from "@/lib/data/queries"
import { AgeGateProvider } from "@/components/age-gate-provider"
import { TutorialOverlay } from "@/components/onboarding/tutorial-overlay"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { profile, school, error } = await getDashboardContext()

  if (error || !profile) {
    redirect("/login")
  }

  // Extract Branding
  const brandingColor = school?.theme_primary || "#808b47"

  return (
    <AgeGateProvider initialProfile={profile}>
      <div 
        className="flex h-screen w-full overflow-hidden bg-[#f5f0e8] selection:bg-[#808b47]/20"
        style={{
          "--tenant-primary": brandingColor,
          // Extract a complementary light hue for backgrounds based on primary
        } as CSSProperties}
      >
        <TutorialOverlay 
          userId={profile.id} 
          hasCompleted={profile.has_completed_tutorial} 
        />

        {/* Sidebar Injection */}
        <DashboardSidebar profile={profile} school={school} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      {/* Global Branding Restyle. We inject the dynamic branding color into Tailwind classes */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --school-brand: ${brandingColor};
        }
        .text-tenant { color: var(--school-brand); }
        .bg-tenant { background-color: var(--school-brand); }
        .border-tenant { border-color: var(--school-brand); }
        .hover\\:bg-tenant:hover { background-color: var(--school-brand); }
        .focus\\:ring-tenant:focus { --tw-ring-color: var(--school-brand); }
      `}} />
    </AgeGateProvider>
  )
}
